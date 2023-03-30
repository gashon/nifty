import WebSocket, { WebSocketServer as Server, ServerOptions } from "ws";
import logger from "@/lib/logger";
import { SocketService } from "@/socket";
import { SOCKET_EVENT } from "@/types";
import { RedisClientType } from "@/lib/redis";

const SAVE_TO_DISK_INTERVAL = 15000; // 15 seconds
export class WebSocketServer extends Server {
  private socketService: SocketService;
  private autoSaveClocks: Record<string, NodeJS.Timeout> = {};

  constructor(redisClient: RedisClientType, options: ServerOptions) {
    super(options);
    this.socketService = new SocketService(redisClient);
    this.autoSaveClocks = {};

    this.on("connection", async (socket, request) => {
      const documentId = request.url?.split("/").pop();
      if (!documentId) return;

      logger.info(`New connection to document: ${documentId}`)
      this.handleConnection(documentId, socket);
    });

    this.on("error", (error) => {
      logger.error(error);
    });
  }

  // todo broadcast user information from all users on join
  async handleConnection(documentId: string, socket: WebSocket) {
    await this.socketService.addEditorToDocument(documentId, socket);

    // broadcast the join to all connected users
    const joinMessage = { event: SOCKET_EVENT.EDITOR_JOIN, payload: { note: { id: documentId } } };
    this.socketService.broadcast(documentId, joinMessage, socket);

    // start autosave clock if not already started
    if (!this.autoSaveClocks[documentId]) {
      this.autoSaveClocks[documentId] = setInterval(async () => {
        logger.info(`Autosaving document: ${documentId}...`)
        await this.syncToDatabase(documentId);
      }, SAVE_TO_DISK_INTERVAL);
    }

    // send the current content to the new user
    const content = await this.socketService.getContent(documentId);
    const contentMessage = { event: SOCKET_EVENT.DOCUMENT_LOAD, payload: { note: { id: documentId, content } } };
    socket.send(JSON.stringify(contentMessage));

    socket.on("message", (message: WebSocket.RawData, _isBinary: boolean) => {
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
          this.handleEditorLeave(documentId, socket);
          break;
        case SOCKET_EVENT.EDITOR_IDLE:
          this.handleEditorIdle(documentId);
          break;
        default:
          socket.send(JSON.stringify({ event: SOCKET_EVENT.ERROR, message: "Invalid message event" }));
      }

    });

    socket.on("close", () => {
      this.handleEditorLeave(documentId, socket);
    });

    socket.on("error", () => {
      this.handleEditorLeave(documentId, socket);
    })
  }

  async handleDocumentUpdate(documentId: string, socket: WebSocket, data: any) {
    const content = data.payload.note.content;
    await this.socketService.setContent(documentId, content, socket);

    const updateMessage = { event: SOCKET_EVENT.DOCUMENT_UPDATE, operations: data.operations };
    this.socketService.broadcast(documentId, updateMessage, socket);
  }

  async handleEditorLeave(documentId: string, socket: WebSocket) {
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
  }

  async handleEditorIdle(documentId: string) {
    const idleMessage = { event: SOCKET_EVENT.EDITOR_IDLE, documentId };
    this.socketService.broadcast(documentId, idleMessage);
  }

  async syncToDatabase(documentId: string) {
    const [_, updated] = await this.socketService.saveContentToDisk(documentId);

    if (updated) {
      const updateMessage = { event: SOCKET_EVENT.DOCUMENT_SAVE, documentId };
      this.socketService.broadcast(documentId, updateMessage);
      logger.info(`Saved document: ${documentId}`)
    }
  }


}