import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import type { RedisClientType } from '@nifty/api-live/lib/redis';
import type { KysleyDB, Note, Selectable } from '@nifty/common/types';
import { db } from '@nifty/common/db';

export class SocketRepository {
  private redis: RedisClientType;
  private socketMap: Map<string, WebSocket> = new Map();
  private db: KysleyDB;

  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
    this.db = db;
  }

  clearRedis() {
    return this.redis.flushAll();
  }

  async getEditors(documentId: number) {
    const editors = await this._redisGet(`document:${documentId}:editors`);
    return editors ? (JSON.parse(editors) as string[]) : ([] as string[]);
  }

  async getEditorSockets(documentId: number): Promise<WebSocket[]> {
    const editors = await this.getEditors(documentId);
    return editors
      .map((editorId) => this.socketMap.get(editorId)!)
      .filter((socket) => socket);
  }

  async addEditor(documentId: number, editor: WebSocket) {
    const editorId = uuidv4();
    this.socketMap.set(editorId, editor);

    const editorIds = await this.getEditors(documentId);
    if (!editorIds.includes(editorId)) {
      await this.redis.set(
        `document:${documentId}:editors`,
        JSON.stringify([...editorIds, editorId])
      );
    }
  }

  async disconnectEditor(documentId: number, editor: WebSocket) {
    const editorIds = await this.getEditors(documentId);
    const editorId = this.getEditorIdBySocket(editor);

    if (!editorId) return;

    this.socketMap.delete(editorId);
    const newEditors = editorIds.filter((e) => e !== editorId);
    await this._redisSet(
      `document:${documentId}:editors`,
      JSON.stringify(newEditors)
    );
  }

  getEditorIdBySocket(editor: WebSocket) {
    return [...this.socketMap.entries()].find(
      (entry) => entry[1] === editor
    )?.[0];
  }

  async getContent(documentId: number) {
    const content = await this._redisGet(`document:${documentId}:content`);
    if (!content) {
      const note = await this.db
        .selectFrom('note')
        .select(['content'])
        .where('id', '=', documentId)
        .executeTakeFirst();
      if (!note) throw new Error('Document not found');

      this.redis.set(`document:${documentId}:content`, note.content);
      return note.content;
    }
    return content ? content : '';
  }

  async setContent(documentId: number, content: string, editor: WebSocket) {
    await this.redis.set(`document:${documentId}:content`, content);
  }

  async getDocumentIdBySocket(editor: WebSocket) {
    const editorId = this.getEditorIdBySocket(editor);
    if (editorId) {
      const documentIds = await this.redis.keys('document:*:editors');
      for (const documentId of documentIds) {
        const editors = await this._redisGet(documentId);
        if (editors && editors.includes(editorId)) {
          return Number(documentId.split(':')[1]);
        }
      }
    }
    return null;
  }

  async removeDocumentFromMemory(documentId: number) {
    await Promise.all([
      this.redis.del(`document:${documentId}:content`),
      this.redis.del(`document:${documentId}:editors`),
    ]);
  }

  async socketIsEditor(documentId: number, editor: WebSocket) {
    const editors = await this.getEditors(documentId);
    const editorId = this.getEditorIdBySocket(editor);
    return editors.includes(editorId!);
  }

  async updateMongoDocument(
    documentId: number,
    content: string
  ): Promise<[Selectable<Note>, boolean]> {
    const note = await this.db
      .selectFrom('note')
      .selectAll()
      .where('id', '=', documentId)
      .executeTakeFirst();
    if (!note) throw new Error('Document not found');

    const isUpdated = content !== note.content;
    if (isUpdated) {
      await this.db
        .updateTable('note')
        .set({ content })
        .where('id', '=', documentId)
        .execute();
    }

    return [note, isUpdated];
  }

  _redisGet(key: string) {
    return new Promise<string | null>((resolve, reject) => {
      this.redis
        .get(key)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _redisSet(key: string, value: string) {
    return new Promise<void>((resolve, reject) => {
      this.redis
        .set(key, value)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
