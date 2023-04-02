import WebSocket, { WebSocketServer as Server, ServerOptions } from "ws";
import AsyncLock from "async-lock";
import logger from "@/lib/logger";
import { SocketService, closeSocketOnError } from "@/socket";
import { SOCKET_EVENT } from "@/types";
import { RedisClientType } from "@/lib/redis";

const SAVE_TO_DISK_INTERVAL = 15000; // 15 seconds
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const LOCK_TIMEOUT = 10000; // 10 seconds

interface WebSocketWithHeartbeat extends WebSocket {
  isAlive?: boolean;
}
export class WebSocketServer extends Server {
  private socketService: SocketService;
  private autoSaveClocks: Record<string, NodeJS.Timeout> = {};
  private syncLock: AsyncLock = new AsyncLock({ timeout: LOCK_TIMEOUT });

  constructor(redisClient: RedisClientType, options: ServerOptions) {
    super(options);
    this.socketService = new SocketService(redisClient);
    this.autoSaveClocks = {};

    const heartbeatInterval = setInterval(() => this.heartbeat(), HEARTBEAT_INTERVAL);
    this.socketService.clearRedis();

    this.on("connection", async (socket, request) => {
      const documentId = request.url?.split("/").pop();
      if (!documentId) return;

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
    this.clients.forEach((socket: WebSocketWithHeartbeat) => {
      if (socket.isAlive === false) {
        this.handleEditorLeave(socket);
        return socket.terminate();
      }

      socket.isAlive = false;
      socket.ping();
    });
  }

  @closeSocketOnError
  async handleConnection(documentId: string, socket: WebSocketWithHeartbeat) {
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

  async broadcastJoin(documentId: string, socket: WebSocketWithHeartbeat) {
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

      const updateMessage = { event: SOCKET_EVENT.DOCUMENT_UPDATE, operations: data.operations };
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
      const editors = await this.socketService.getEditors(documentId);
      if (editors.length === 0) {
        clearInterval(this.autoSaveClocks[documentId]);
        delete this.autoSaveClocks[documentId];

        await this.socketService.removeDocumentFromMemory(documentId);
      }
    })
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

  @closeSocketOnError
  handleMessage(documentId: string, message: WebSocket.RawData, socket: WebSocketWithHeartbeat) {
    try {
      const data = this.socketService.parse(message);

      if (!data) {
        socket.send(JSON.stringify({ event: SOCKET_EVENT.ERROR, message: "Invalid message format" }));
        return;
      }

      switch (data.event) {
        case SOCKET_EVENT.DOCUMENT_UPDATE:
          this.handleDocumentUpdate(documentId, socket, data);
          break;
        case SOCKET_EVENT.EDITOR_LEAVE:
          this.handleEditorLeave(socket, documentId);
          break;
        case SOCKET_EVENT.EDITOR_IDLE:
          this.handleEditorIdle(documentId);
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