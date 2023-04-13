import WebSocket, { WebSocketServer as Server, ServerOptions } from "ws";
import AsyncLock from "async-lock";
import logger from "@/lib/logger";
import { checkPermissions, Permission } from "@nifty/api/util/handle-permissions"
import { SocketService, closeSocketOnError } from "@/socket";
import { SOCKET_EVENT } from "@/types";
import { RedisClientType } from "@/lib/redis";
import { CollaboratorDocument } from "@nifty/server-lib/models/collaborator";
import { NoteDocument } from "@nifty/server-lib/models/note";

const SAVE_TO_DISK_INTERVAL = 15000; // 15 seconds
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const LOCK_TIMEOUT = 10000; // 10 seconds

interface WebSocketSession extends WebSocket {
  isAlive?: boolean;
  collaborator?: CollaboratorDocument;
  notePermissions?: Permission
}

// todo attach permissions to the note editing socket
export class WebSocketServer extends Server {
  private socketService: SocketService;
  private autoSaveClocks: Record<string, NodeJS.Timeout> = {};
  private syncLock: AsyncLock = new AsyncLock({ timeout: LOCK_TIMEOUT });

  constructor(redisClient: RedisClientType, options: ServerOptions) {
    super(options);
    this.socketService = new SocketService(redisClient);
    // todo store in redis
    this.autoSaveClocks = {};

    const heartbeatInterval = setInterval(() => this.heartbeat(), HEARTBEAT_INTERVAL);
    this.socketService.clearRedis();

    this.on("connection", async (socket: WebSocketSession, request) => {
      const documentId = request.url?.split("/").pop();
      if (!documentId) return;

      // get access token from cookie
      const accessToken = request.headers["cookie"]?.split(";").find((cookie) => cookie.includes("access_token"))?.split("=")[1];
      if (!accessToken) {
        logger.error("No access token found");
        socket.close();
        return;
      }

      try {
        // get note permissions and validate access
        const [notePermissions, [hasAccess, collaborator]] = await Promise.all([
          this.socketService.getNotePermissions(documentId),
          this.socketService.validateAccess(accessToken as string, documentId)
        ]);

        if (!hasAccess)
          throw new Error("You do not have access to this document");

        // attach user permissions to the socket
        // todo store in redis
        socket["collaborator"] = collaborator;
        socket["notePermissions"] = notePermissions;
      } catch (err) {
        // @ts-ignore
        logger.error(err.message)
        socket.close();
        return;
      }

      logger.info(`New connection to document: ${documentId}`)
      this.handleConnection(documentId, socket);
    });

    this.on("error", (error) => {
      logger.error(error);
      clearInterval(heartbeatInterval)
    });

    this.on("close", () => {
      logger.info("Closing websocket server...");
      clearInterval(heartbeatInterval)
    });
  }

  heartbeat() {
    this.clients.forEach((socket: WebSocketSession) => {
      if (socket.isAlive === false) {
        logger.info("Socket is dead, closing connection");
        this.handleEditorLeave(socket);
        return socket.terminate();
      }

      logger.info("Socket is alive, sending heartbeat");
      socket.isAlive = false;
      socket.ping();
    });
  }

  @closeSocketOnError
  async handleConnection(documentId: string, socket: WebSocketSession) {
    await this.syncLock.acquire(["connection", documentId], async () => {
      await this.socketService.addEditorToDocument(documentId, socket);

      socket.isAlive = true;
      // broadcast the join to all connected users
      this.broadcastJoin(documentId, socket);
      // start autosave clock if not already started
      this.findOrStartAutoSaveClock(documentId)
      // send the current content to the new user
      this.sendCurrentDocumentContent(documentId, socket);

      socket.on("pong", () => {
        socket.isAlive = true;
      });

      socket.on("message", (message: WebSocket.RawData, _isBinary: boolean) => {
        this.handleMessage(documentId, message, socket);
      });

      socket.on("close", () => {
        this.handleEditorLeave(socket, documentId);
      });

      socket.on("error", () => {
        this.handleEditorLeave(socket, documentId);
      })
    });
  }

  async broadcastJoin(documentId: string, socket: WebSocketSession) {
    try {
      const joinMessage = { event: SOCKET_EVENT.EDITOR_JOIN, payload: { note: { id: documentId } } };
      this.socketService.broadcast(documentId, joinMessage, socket);
    } catch (err) {
      logger.error(err);
    }
  }

  async findOrStartAutoSaveClock(documentId: string) {
    try {
      await this.syncLock.acquire(["autosave", documentId], async () => {
        if (!this.autoSaveClocks[documentId]) {
          this.autoSaveClocks[documentId] = setInterval(async () => {
            logger.info(`Autosaving document: ${documentId}...`)
            await this.syncToDatabase(documentId);
          }, SAVE_TO_DISK_INTERVAL);
        }
      })
    } catch (err) {
      logger.error(err);
    }
  }

  async sendCurrentDocumentContent(documentId: string, socket: WebSocket) {
    try {
      const content = await this.socketService.getContent(documentId);
      const contentMessage = { event: SOCKET_EVENT.DOCUMENT_LOAD, payload: { note: { id: documentId, content } } };
      socket.send(JSON.stringify(contentMessage));
    } catch (err) {
      logger.error(err);
      socket.close();
    }
  }

  async handleDocumentUpdate(documentId: string, socket: WebSocket, data: any) {
    try {
      const content = data.payload.note.content;
      await this.socketService.setContent(documentId, content, socket);

      const updateMessage = {
        event: SOCKET_EVENT.DOCUMENT_UPDATE, payload: {
          note: { id: documentId, content },
        }
      };
      this.socketService.broadcast(documentId, updateMessage, socket);
    } catch (err) {
      logger.error(err);
      socket.close();
    }
  }

  async handleEditorLeave(socket: WebSocket): Promise<void>
  async handleEditorLeave(socket: WebSocket, docId: string,): Promise<void>
  async handleEditorLeave(socket: WebSocket, docId?: string): Promise<void> {
    await this.syncLock.acquire(["disconnection", docId || "unknown"], async () => {
      const documentId = docId || await this.socketService.getDocumentIdBySocket(socket);
      if (!documentId) return;

      await Promise.all([
        this.syncToDatabase(documentId),
        this.socketService.disconnectEditor(documentId, socket),
      ])

      const leaveMessage = { event: SOCKET_EVENT.EDITOR_LEAVE, documentId };
      this.socketService.broadcast(documentId, leaveMessage);

      // stop autosave clock if no editors left
      const editors = await this.socketService.getEditorSockets(documentId);
      if (editors.length === 0) {
        logger.info(`Stopping autosave clock for document: ${documentId}`);
        clearInterval(this.autoSaveClocks[documentId]);
        delete this.autoSaveClocks[documentId];

        await this.socketService.removeDocumentFromMemory(documentId);
      }
    })
  }

  // ping all editors to make sure they are still alive
  // if they are not, remove them from the list of editors
  // todo implement this as a fallback if the editor does not send a leave message
  async countAndPruneActiveEditors(documentId: string): Promise<number> {
    const sockets = await this.socketService.getEditorSockets(documentId);

    const activeEditors = await Promise.all(sockets.map(async (socket) => {
      try {
        logger.info("Pinging sockets");
        await this.socketService.pingSocket(socket);
        return socket;
      } catch (err) {
        logger.error(`Error: ${err}`);
        this.handleEditorLeave(socket, documentId);
        return null;
      }
    }));
    return activeEditors.length;
  }

  @closeSocketOnError
  async handleEditorIdle(documentId: string) {
    try {
      const idleMessage = { event: SOCKET_EVENT.EDITOR_IDLE, documentId };
      this.socketService.broadcast(documentId, idleMessage);
    } catch (err) {
      logger.error(err);
    }
  }

  async syncToDatabase(documentId: string) {
    try {
      const [_, updated] = await this.socketService.saveContentToDisk(documentId);

      if (updated) {
        const updateMessage = { event: SOCKET_EVENT.DOCUMENT_SAVE, documentId };
        this.socketService.broadcast(documentId, updateMessage);
        logger.info(`Saved document: ${documentId}`)
      }
    } catch (err) {
      logger.error(err);
    }
  }

  validatePermissions(socket: WebSocketSession, requiredPermissions: Permission): boolean {
    const hasPublicPermission = checkPermissions(socket.notePermissions!, requiredPermissions);
    if (hasPublicPermission) return true;

    if (!socket.collaborator) {
      socket.send(JSON.stringify({ event: SOCKET_EVENT.PERMISSION_ERROR, message: "You do not have permission to perform this action" }));
      return false;
    }

    const hasCollaboratorPermission = checkPermissions(socket.collaborator.permissions, requiredPermissions);
    if (!hasCollaboratorPermission) {
      socket.send(JSON.stringify({ event: SOCKET_EVENT.PERMISSION_ERROR, message: "You do not have permission to perform this action" }));
      return false;
    }

    return true;
  }

  @closeSocketOnError
  handleMessage(documentId: string, message: WebSocket.RawData, socket: WebSocketSession) {
    try {
      const data = this.socketService.parse(message);
      if (!data) {
        socket.send(JSON.stringify({ event: SOCKET_EVENT.ERROR, message: "Invalid message format" }));
        return;
      }

      switch (data.event) {
        case SOCKET_EVENT.DOCUMENT_UPDATE:
          if (this.validatePermissions(socket, Permission.ReadWrite)) {
            this.handleDocumentUpdate(documentId, socket, data);
          }
          break;
        case SOCKET_EVENT.EDITOR_LEAVE:
          this.handleEditorLeave(socket, documentId);
          break;
        case SOCKET_EVENT.EDITOR_IDLE:
          this.handleEditorIdle(documentId);
          break;
        case SOCKET_EVENT.EDITOR_PONG: // handled at the service layer (pingSocket)
          break;
        default:
          socket.send(JSON.stringify({ event: SOCKET_EVENT.ERROR, message: "Invalid message event" }));
      }
    } catch (err) {
      logger.error(err);
      socket.close();
    }
  }

}