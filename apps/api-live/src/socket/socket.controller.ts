import WebSocket, { WebSocketServer as Server, ServerOptions } from "ws";
import { SocketService } from "./socket.service";
import { SOCKET_EVENT } from "@/types";

export class WebSocketServer extends Server {
  private socketService: SocketService;

  constructor(options: ServerOptions) {
    super(options);
    this.socketService = new SocketService();
  }

  async handleConnection(documentId: string, socket: WebSocket) {
    await this.socketService.addEditorToDocument(documentId, socket);

    // broadcast the join to all connected users
    const joinMessage = { type: SOCKET_EVENT.EDITOR_JOIN, documentId };
    this.socketService.broadcast(documentId, joinMessage);

    socket.on("message", (message) => {
      const data = this.socketService.parse(message);
      if (!data) return;

      switch (data.type) {
        case SOCKET_EVENT.DOCUMENT_UPDATE:
          this.handleDocumentUpdate(documentId, socket, data);
          break;
        case SOCKET_EVENT.EDITOR_LEAVE:
          break;
        default:
          console.log("NOT IMPLEMENTD")
      }

    });
  }

  async handleDocumentUpdate(documentId: string, socket: WebSocket, data: any) {
    // todo - validate data
    // todo - count updates and save to database every 10 updates
    const { content } = data;
    await this.socketService.setContent(documentId, content, socket);

    // broadcast the update to all connected users
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

  async syncToDatabase(documentId: string) {
    // todo - consider using a queue to handle this
    // todo - consider remove the need for an editor to be passed in
    const content = await this.socketService.getContent(documentId);

    // todo - save to database

    // broadcast the update to all connected users
    const updateMessage = { type: SOCKET_EVENT.DOCUMENT_SAVE, content };
    this.socketService.broadcast(documentId, updateMessage);
  }


}