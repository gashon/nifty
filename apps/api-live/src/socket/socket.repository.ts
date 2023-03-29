import { WebSocket } from "ws";
import { promisify } from "util"
import { RedisClientType } from "@/lib/redis";
import { Document, Store } from "@/types/document";

type RedisCallback<T> = (err: Error | null, reply: T) => void;

export class SocketRepository {
  private redis: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
  }

  async getEditors(documentId: string) {
    const editors = await this._redisGet(`document:${documentId}:editors`);
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
    const content = await this._redisGet(`document:${documentId}:content`);
    return content ? content : "";
  }

  async setContent(documentId: string, content: string, editor: WebSocket) {
    await this.redis.set(`document:${documentId}:content`, content);
  }

  async socketIsEditor(documentId: string, editor: WebSocket) {
    const editors = await this.getEditors(documentId);
    return editors.includes(editor);
  }

  _redisGet(key: string) {
    return new Promise<string | null>((resolve, reject) => {
      this.redis.get(key).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  };

}