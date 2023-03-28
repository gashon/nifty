import { WebSocket } from "ws";
import { redisClient, redisGet } from "@/lib/redis";
import { Document, Store } from "@/types/document";

export class SocketRepository {
  private redis: typeof redisClient;

  constructor() {
    this.redis = redisClient;
    this.redis.get = redisGet;
  }

  async getEditors(documentId: string) {
    const editors = await this.redis.get(`document:${documentId}:editors`);
    return editors ? JSON.parse(editors) as WebSocket[] : [] as WebSocket[];
  }

  async addEditor(documentId: string, editor: WebSocket) {
    const editors = await this.getEditors(documentId);
    if (!editors.includes(editor)) {
      await this.redis.set(`document:${documentId}:editors`, JSON.stringify([...editors, editor]));
    }
  }

  async removeEditor(documentId: string, editor: WebSocket) {
    const editors = await this.getEditors(documentId);
    const newEditors = editors.filter((e) => e !== editor);
    await this.redis.set(`document:${documentId}:editors`, JSON.stringify(newEditors));
  }

  async getContent(documentId: string) {
    const content = await this.redis.get(`document:${documentId}:content`);
    return content ? content : "";
  }

  async setContent(documentId: string, content: string, editor: WebSocket) {
    await this.redis.set(`document:${documentId}:content`, content);
  }

  async socketIsEditor(documentId: string, editor: WebSocket) {
    const editors = await this.getEditors(documentId);
    return editors.includes(editor);
  }

}