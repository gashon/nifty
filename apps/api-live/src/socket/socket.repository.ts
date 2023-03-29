import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { Model } from "mongoose"
import { RedisClientType } from "@/lib/redis";
import { Document, Store } from "@/types/document";
import Note, { NoteDocument } from "@nifty/server-lib/models/note";

export class SocketRepository {
  private redis: RedisClientType;
  private socketMap: Map<string, WebSocket> = new Map();
  private noteModel: Model<NoteDocument>;

  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
    this.noteModel = Note;
  }

  async getEditors(documentId: string) {
    const editors = await this._redisGet(`document:${documentId}:editors`);
    return editors ? JSON.parse(editors) as string[] : [] as string[];
  }

  async getEditorSockets(documentId: string): Promise<WebSocket[]> {
    const editors = await this.getEditors(documentId);
    return editors.map((editorId) => this.socketMap.get(editorId)!).filter((socket) => socket);
  }

  async addEditor(documentId: string, editor: WebSocket) {
    const editorId = uuidv4();
    this.socketMap.set(editorId, editor);

    const editorIds = await this.getEditors(documentId);
    if (!editorIds.includes(editorId)) {
      await this.redis.set(`document:${documentId}:editors`, JSON.stringify([...editorIds, editorId]));
    }
  }

  async disconnectEditor(documentId: string, editor: WebSocket) {
    const editorIds = await this.getEditors(documentId);
    const editorId = this.getEditorIdBySocket(editor)

    if (!editorId) throw new Error("Editor not found");

    this.socketMap.delete(editorId);
    const newEditors = editorIds.filter((e) => e !== editorId);
    await this.redis.set(`document:${documentId}:editors`, JSON.stringify(newEditors));
  }

  getEditorIdBySocket(editor: WebSocket) {
    return [...this.socketMap.entries()].find((entry) => entry[1] === editor)?.[0];
  }

  async getContent(documentId: string) {
    const content = await this._redisGet(`document:${documentId}:content`);
    if (!content) {
      const note = await this.noteModel.findById(documentId);
      if (!note) throw new Error("Document not found");

      this.redis.set(`document:${documentId}:content`, note.content);
      return note.content;
    }
    return content ? content : "";
  }

  async setContent(documentId: string, content: string, editor: WebSocket) {
    await this.redis.set(`document:${documentId}:content`, content);
  }

  async removeDocumentFromMemory(documentId: string) {
    await Promise.all([
      this.redis.del(`document:${documentId}:content`),
      this.redis.del(`document:${documentId}:editors`),
    ])
  }

  async socketIsEditor(documentId: string, editor: WebSocket) {
    const editors = await this.getEditors(documentId);
    const editorId = this.getEditorIdBySocket(editor);
    return editors.includes(editorId!);
  }

  async updateMongoDocument(documentId: string, content: string) {
    const note = await this.noteModel.findById(documentId);
    if (!note) throw new Error("Document not found");

    const isUpdated = content !== note.content
    if (isUpdated) {
      note.content = content;
      await note.save();
    }

    return [note, isUpdated]
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