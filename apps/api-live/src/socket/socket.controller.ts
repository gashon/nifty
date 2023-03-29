import WebSocket, { WebSocketServer as Server, ServerOptions } from "ws";
import { SocketService } from "@/socket/socket.service";
import { SOCKET_EVENT } from "@/types";
import { RedisClientType } from "@/lib/redis";

export class WebSocketServer extends Server {
  private socketService: SocketService;

  constructor(redisClient: RedisClientType, options: ServerOptions) {
    super(options);
    this.socketService = new SocketService(redisClient);

    this.on("connection", async (socket, request) => {

      const documentId = request.url?.split("/").pop();
      if (!documentId) return;

      this.handleConnection(documentId, socket);
    });

    this.on("error", (error) => {
      console.log("ERROR", error);
    });
  }

  // todo broadcast user information from all users on join
  async handleConnection(documentId: string, socket: WebSocket) {
    console.log("HITTING")
    await this.socketService.addEditorToDocument(documentId, socket);

    // broadcast the join to all connected users
    const joinMessage = { type: SOCKET_EVENT.EDITOR_JOIN, documentId };
    console.log("JOIN", joinMessage, documentId)
    this.socketService.broadcast(documentId, joinMessage);

    socket.on("message", (message) => {
      console.log("GOT MESSAGE")
      const data = this.socketService.parse(message);
      if (!data) return;

      switch (data.type) {
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
          console.log("NOT IMPLEMENTD")
      }

    });

    socket.on("close", () => {
      this.handleEditorLeave(documentId, socket);
    });

    socket.on("error", () => {
      this.handleEditorDisconnect(documentId, socket);
    })
  }

  async handleDocumentUpdate(documentId: string, socket: WebSocket, data: any) {
    // todo - validate data
    // todo - count updates and save to database every 10 updates
    const { content } = data;
    await this.socketService.setContent(documentId, content, socket);

    const updateMessage = { type: SOCKET_EVENT.DOCUMENT_UPDATE, content };
    this.socketService.broadcast(documentId, updateMessage);
  }

  async handleEditorLeave(documentId: string, socket: WebSocket) {
    await this.syncToDatabase(documentId);
    await this.socketService.removeEditorFromDocument(documentId, socket);

    const leaveMessage = { type: SOCKET_EVENT.EDITOR_LEAVE, documentId };
    this.socketService.broadcast(documentId, leaveMessage);
  }

  async handleEditorDisconnect(documentId: string, socket: WebSocket) {
    await this.syncToDatabase(documentId);
    await this.socketService.removeEditorFromDocument(documentId, socket);

    const disconnectMessage = { type: SOCKET_EVENT.EDITOR_DISCONNECT, documentId };
    this.socketService.broadcast(documentId, disconnectMessage);
  }

  async handleEditorIdle(documentId: string) {
    const idleMessage = { type: SOCKET_EVENT.EDITOR_IDLE, documentId };
    this.socketService.broadcast(documentId, idleMessage);
  }

  async syncToDatabase(documentId: string) {
    // todo - consider using a queue to handle this
    // todo - consider remove the need for an editor to be passed in
    // todo - save to database

    const updateMessage = { type: SOCKET_EVENT.DOCUMENT_SAVE };
    this.socketService.broadcast(documentId, updateMessage);
  }


}