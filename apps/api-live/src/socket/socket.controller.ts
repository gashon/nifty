import WebSocket, { WebSocketServer as Server, ServerOptions } from "ws";
import { SocketService } from "@/socket/socket.service";
import { SOCKET_EVENT } from "@/types";
import { RedisClientType } from "@/lib/redis";

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

type SocketMessage = {
  type: SOCKET_EVENT;
  senderId: string;
  data: any; // todo create different types for different events
}

function isSocketMessage(obj: any): obj is SocketMessage {
  return (
    typeof obj === "object" &&
    "type" in obj &&
    "senderId" in obj &&
    "data" in obj &&
    Object.values(SOCKET_EVENT).includes(obj.type) &&
    typeof obj.senderId === "string"
  );
}

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

      console.log("Connection to", documentId)

      this.handleConnection(documentId, socket);
    });

    this.on("error", (error) => {
      console.log("ERROR", error);
    });
  }

  // todo broadcast user information from all users on join
  async handleConnection(documentId: string, socket: WebSocket) {
    await this.socketService.addEditorToDocument(documentId, socket);

    // broadcast the join to all connected users
    const joinMessage = { type: SOCKET_EVENT.EDITOR_JOIN, documentId };
    this.socketService.broadcast(documentId, joinMessage, socket);

    // start autosave clock if not already started
    if (!this.autoSaveClocks[documentId]) {
      this.autoSaveClocks[documentId] = setInterval(async () => {
        await this.syncToDatabase(documentId);
      }, AUTO_SAVE_INTERVAL);
    }

    // send the current content to the new user
    const content = await this.socketService.getContent(documentId);
    const contentMessage = { type: SOCKET_EVENT.DOCUMENT_LOAD, documentId, content };
    socket.send(JSON.stringify(contentMessage));

    socket.on("message", (message: WebSocket.RawData, _isBinary: boolean) => {
      const data = this.socketService.parse(message);
      if (!data) {
        socket.send(JSON.stringify({ type: SOCKET_EVENT.ERROR, message: "Invalid message format" }));
        return;
      }

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
          socket.send(JSON.stringify({ type: SOCKET_EVENT.ERROR, message: "Invalid message type" }));
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
    this.socketService.broadcast(documentId, updateMessage, socket);
  }

  async handleEditorLeave(documentId: string, socket: WebSocket) {
    await Promise.all([
      this.syncToDatabase(documentId),
      this.socketService.removeEditorFromDocument(documentId, socket),
    ])

    const leaveMessage = { type: SOCKET_EVENT.EDITOR_LEAVE, documentId };
    this.socketService.broadcast(documentId, leaveMessage);

    // stop autosave clock if no editors left
    const editors = await this.socketService.getEditors(documentId);
    if (editors.length === 0) {
      clearInterval(this.autoSaveClocks[documentId]);
      delete this.autoSaveClocks[documentId];
    }
  }

  async handleEditorDisconnect(documentId: string, socket: WebSocket) {
    await Promise.all([
      this.syncToDatabase(documentId),
      this.socketService.removeEditorFromDocument(documentId, socket),
    ])

    const disconnectMessage = { type: SOCKET_EVENT.EDITOR_DISCONNECT, documentId };
    this.socketService.broadcast(documentId, disconnectMessage);

    // stop autosave clock if no editors left
    const editors = await this.socketService.getEditors(documentId);
    if (editors.length === 0) {
      clearInterval(this.autoSaveClocks[documentId]);
      delete this.autoSaveClocks[documentId];
    }
  }

  async handleEditorIdle(documentId: string) {
    const idleMessage = { type: SOCKET_EVENT.EDITOR_IDLE, documentId };
    this.socketService.broadcast(documentId, idleMessage);
  }

  async syncToDatabase(documentId: string) {
    const [_, updated] = await this.socketService.saveContentToDisk(documentId);

    if (updated) {
      const updateMessage = { type: SOCKET_EVENT.DOCUMENT_SAVE, documentId };
      this.socketService.broadcast(documentId, updateMessage);
    }
  }


}