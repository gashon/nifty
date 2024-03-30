import WebSocket, { RawData, OPEN } from 'ws';

import { RedisClientType } from '@nifty/api-live/lib/redis';
import { SocketRepository } from './socket.repository';
import { SOCKET_EVENT } from '@nifty/api-live/types';
import { Permission, isPermitted } from '@nifty/api/util/handle-permissions';
import type {
  Note,
  Collaborator,
  KysleyDB,
  AccessTokenJwt,
  Selectable,
} from '@nifty/common/types';
import { db } from '@nifty/common/db';
import { verifyToken } from '@nifty/api/lib/jwt';

export class SocketService {
  private socketRepository: SocketRepository;
  private db: KysleyDB;

  constructor(redisClient: RedisClientType) {
    this.socketRepository = new SocketRepository(redisClient);
    this.db = db;
  }

  // call with a socket to broadcast to all other sockets
  async broadcast(documentId: number, message: object): Promise<void>;
  async broadcast(
    documentId: number,
    message: object,
    socket: WebSocket
  ): Promise<void>;
  async broadcast(documentId: number, message: object, socket?: WebSocket) {
    const payload = JSON.stringify(message);
    const editors = await this.socketRepository.getEditorSockets(documentId);
    editors.forEach((editor) => {
      if (editor !== socket && editor.readyState === OPEN) {
        editor.send(payload);
      }
    });
  }

  clearRedis() {
    return this.socketRepository.clearRedis();
  }

  async getNotePermissions(documentId: number): Promise<Permission> {
    const note = await this.db
      .selectFrom('note')
      .select('publicPermissions')
      .where('id', '=', documentId)
      .executeTakeFirst();
    if (!note) throw new Error('Document not found');

    return note.publicPermissions;
  }

  async validateAccess(
    accessToken: string,
    documentId: number
  ): Promise<{
    hasAccess: boolean;
    collaborator: Selectable<Collaborator> | null;
  }> {
    const notePermissions = await this.getNotePermissions(documentId);

    // token is in req headers
    const token = verifyToken<AccessTokenJwt>(accessToken);
    if (!token) throw new Error('Invalid access token');

    const hasPublicPermissions = isPermitted(notePermissions, Permission.Read);
    if (hasPublicPermissions) return { hasAccess: true, collaborator: null };

    // check if user is a collaborator
    const collaborator = await this.db
      .selectFrom('collaborator')
      .innerJoin(
        'noteCollaborator',
        'noteCollaborator.collaboratorId',
        'collaborator.id'
      )
      .selectAll()
      .where('collaborator.userId', '=', token.user.id)
      .where('noteCollaborator.noteId', '=', documentId)
      .executeTakeFirst();

    if (!collaborator)
      throw new Error("You don't have access to this document");

    // update last viewed at
    db.updateTable('collaborator')
      .set({ lastViewedAt: new Date() })
      .where('id', '=', collaborator.id)
      .execute();
    return { hasAccess: true, collaborator };
  }

  async getEditorSockets(documentId: number): Promise<WebSocket[]> {
    return this.socketRepository.getEditorSockets(documentId);
  }

  async getEditors(documentId: number): Promise<string[]> {
    return this.socketRepository.getEditors(documentId);
  }

  async addEditorToDocument(documentId: number, editor: WebSocket) {
    return this.socketRepository.addEditor(documentId, editor);
  }

  async disconnectEditor(documentId: number, editor: WebSocket) {
    return this.socketRepository.disconnectEditor(documentId, editor);
  }

  async getDocumentIdBySocket(editor: WebSocket): Promise<number | null> {
    return this.socketRepository.getDocumentIdBySocket(editor);
  }

  async setContent(documentId: number, content: string, editor: WebSocket) {
    if (!this.socketRepository.socketIsEditor(documentId, editor))
      throw new Error('You are not an editor of this document');
    return this.socketRepository.setContent(documentId, content, editor);
  }

  async getContent(documentId: number): Promise<string>;
  async getContent(documentId: number, editor?: WebSocket): Promise<string> {
    if (editor && !this.socketRepository.socketIsEditor(documentId, editor))
      throw new Error('You are not an editor of this document');
    return this.socketRepository.getContent(documentId);
  }

  async removeDocumentFromMemory(documentId: number) {
    return this.socketRepository.removeDocumentFromMemory(documentId);
  }

  // send a request to the socket to see if it's still alive
  // if it's not, throw an error
  async pingSocket(socket: WebSocket) {
    return new Promise((resolve, reject) => {
      const pingMessage = { event: SOCKET_EVENT.EDITOR_PING };
      socket.send(JSON.stringify(pingMessage));
      const timeout = setTimeout(() => {
        reject(new Error('Socket timed out'));
      }, 1000);
      socket.once('message', (data) => {
        clearTimeout(timeout);
        const message = JSON.parse(data.toString());
        if (message.event === SOCKET_EVENT.EDITOR_PONG) {
          resolve(true);
        } else {
          reject(new Error('Socket did not respond with PONG'));
        }
      });
    });
  }

  // pass editor to require permissions
  async saveContentToDisk(documentId: number, editor?: WebSocket) {
    if (editor && !this.socketRepository.socketIsEditor(documentId, editor))
      throw new Error('You are not an editor of this document');

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

      return JSON.parse(data as string);
    } catch (error) {
      return null;
    }
  }
}
