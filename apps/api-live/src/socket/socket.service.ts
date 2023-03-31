import WebSocket, { RawData, OPEN } from "ws";
import { RedisClientType } from "@/lib/redis";
import { SocketRepository } from "./socket.repository";
import { NoteDocument } from "@nifty/server-lib/models/note";


export class SocketService {
  private socketRepository: SocketRepository;

  constructor(redisClient: RedisClientType) {
    this.socketRepository = new SocketRepository(redisClient);
  }

  // call with a socket to broadcast to all other sockets
  async broadcast(documentId: string, message: object): Promise<void>;
  async broadcast(documentId: string, message: object, socket: WebSocket): Promise<void>;
  async broadcast(documentId: string, message: object, socket?: WebSocket) {
    const payload = JSON.stringify(message);
    const editors = await this.socketRepository.getEditorSockets(documentId);
    editors.forEach((editor) => {
      if (editor !== socket && editor.readyState === OPEN) {
        editor.send(payload);
      }
    });
  }

  async getEditors(documentId: string): Promise<string[]> {
    return this.socketRepository.getEditors(documentId);
  }

  async addEditorToDocument(documentId: string, editor: WebSocket) {
    return this.socketRepository.addEditor(documentId, editor);
  }

  async disconnectEditor(documentId: string, editor: WebSocket) {
    return this.socketRepository.disconnectEditor(documentId, editor);
  }

  async getDocumentIdBySocket(editor: WebSocket): Promise<string | null> {
    return this.socketRepository.getDocumentIdBySocket(editor);
  }

  async setContent(documentId: string, content: string, editor: WebSocket) {
    if (!this.socketRepository.socketIsEditor(documentId, editor)) throw new Error("You are not an editor of this document");
    return this.socketRepository.setContent(documentId, content, editor);
  }

  async getContent(documentId: string): Promise<string>
  async getContent(documentId: string, editor?: WebSocket): Promise<string> {
    if (editor && !this.socketRepository.socketIsEditor(documentId, editor)) throw new Error("You are not an editor of this document");
    return this.socketRepository.getContent(documentId);
  }

  async removeDocumentFromMemory(documentId: string){
    return this.socketRepository.removeDocumentFromMemory(documentId);
  }

  // pass editor to require permissions
  async saveContentToDisk(documentId: string): Promise<[NoteDocument, boolean]>;
  async saveContentToDisk(documentId: string, editor: WebSocket): Promise<[NoteDocument, boolean]>;
  async saveContentToDisk(documentId: string, editor?: WebSocket) {
    if (editor && !this.socketRepository.socketIsEditor(documentId, editor)) throw new Error("You are not an editor of this document");

    const memoryContent = await this.socketRepository.getContent(documentId);
    return this.socketRepository.updateMongoDocument(documentId, memoryContent);
  }

  parse(message: RawData): Record<string, unknown> | null {
    try {
      const data =
        message instanceof ArrayBuffer
          ? new TextDecoder().decode(message)
          : message instanceof Buffer
            ? message.toString()
            : message;

      return JSON.parse(data as string)
    } catch (error) {
      return null;
    }
  }

}