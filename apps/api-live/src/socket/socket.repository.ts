import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import type { RedisClientType } from '@nifty/api-live/lib/redis';
import type {
  Collaborator,
  KysleyDB,
  Note,
  Selectable,
} from '@nifty/common/types';
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
    const editors = await this._redisGet<string[]>(
      `document:${documentId}:editors`
    );
    return editors || [];
  }

  async getEditorSockets(documentId: number): Promise<WebSocket[]> {
    const editors = await this.getEditors(documentId);
    return editors.map((editorId) => this.socketMap.get(editorId)!);
  }

  async addEditor(documentId: number, editor: WebSocket) {
    const editorId = uuidv4();

    this.socketMap.set(editorId, editor);
    const editorIds = await this.getEditors(documentId);

    if (!editorIds.includes(editorId)) {
      await this._redisSet(`document:${documentId}:editors`, [
        ...editorIds,
        editorId,
      ]);
    }
  }

  async disconnectEditor(documentId: number, editor: WebSocket) {
    const editorIds = await this.getEditors(documentId);
    const editorId = this.getEditorIdBySocket(editor);

    if (!editorId) return;

    this.socketMap.delete(editorId);
    const newEditors = editorIds.filter((e) => e !== editorId);
    await this._redisSet(`document:${documentId}:editors`, newEditors);
  }

  getEditorIdBySocket(editor: WebSocket) {
    return [...this.socketMap.entries()].find(
      (entry) => entry[1] === editor
    )?.[0];
  }

  async getContent(documentId: number): Promise<string> {
    const content = await this._redisGet<string>(
      `document:${documentId}:content`
    );

    if (content) return content;

    // if not in redis, fetch from db
    const note = await this.db
      .selectFrom('note')
      .select(['content'])
      .where('id', '=', documentId)
      .executeTakeFirst();
    if (!note) throw new Error('Document not found');

    await this._redisSet(`document:${documentId}:content`, note.content);
    return note.content?.toString() || '';
  }

  async setContent(documentId: number, content: string, editor: WebSocket) {
    await this._redisSet(`document:${documentId}:content`, content);
  }

  async getDocumentIdBySocket(editor: WebSocket) {
    const editorId = this.getEditorIdBySocket(editor);
    if (editorId) {
      const documentIds = await this.redis.keys('document:*:editors');
      for (const idString of documentIds) {
        const documentId = idString.split(':')[1];
        const editors = await this.getEditors(Number(documentId));
        if (editors && editors.includes(editorId)) {
          return Number(documentId);
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

  async writeToDB(
    documentId: number,
    content: string
  ): Promise<[Selectable<Note>, boolean]> {
    const note = await this.db
      .selectFrom('note')
      .selectAll()
      .where('id', '=', documentId)
      .executeTakeFirst();
    if (!note) throw new Error('Document not found');

    const isUpdated = content !== note.content?.toString();
    if (isUpdated) {
      await this.db
        .updateTable('note')
        .set({ content: new Buffer(content) })
        .where('id', '=', documentId)
        .execute();
    }

    return [note, isUpdated];
  }

  _redisGet<T>(key: string) {
    return new Promise<T | null>((resolve, reject) => {
      this.redis
        .get(key)
        .then((result) => {
          resolve(result ? JSON.parse(result) : null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  _redisSet(key: string, value: any) {
    return new Promise<void>((resolve, reject) => {
      this.redis
        .set(key, JSON.stringify(value))
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
