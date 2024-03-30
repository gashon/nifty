import WebSocket, { RawData, OPEN } from 'ws';
import { Model } from 'mongoose';
import { RedisClientType } from '@nifty/api-live/lib/redis';
import { SocketRepository } from './socket.repository';
import Note, { INote } from '@nifty/server-lib/models/note';
import AccessToken, { IToken } from '@nifty/server-lib/models/token';
import Collaborator, {
  ICollaborator,
} from '@nifty/server-lib/models/collaborator';
import { SOCKET_EVENT } from '@nifty/api-live/types';
import { Permission, isPermitted } from '@nifty/api/util/handle-permissions';

export class SocketService {
  private socketRepository: SocketRepository;
  private noteModel: Model<INote>;
  private accessTokenModel: Model<IToken>;
  private collaboratorModel: Model<ICollaborator>;

  constructor(redisClient: RedisClientType) {
    this.socketRepository = new SocketRepository(redisClient);
    this.collaboratorModel = Collaborator;
    this.accessTokenModel = AccessToken;
    this.noteModel = Note;
  }

  // call with a socket to broadcast to all other sockets
  async broadcast(documentId: string, message: object): Promise<void>;
  async broadcast(
    documentId: string,
    message: object,
    socket: WebSocket
  ): Promise<void>;
  async broadcast(documentId: string, message: object, socket?: WebSocket) {
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

  async getNotePermissions(documentId: string): Promise<Permission> {
    const note = await this.noteModel.findById(documentId);
    if (!note) throw new Error('Document not found');
    return note.public_permissions;
  }

  async validateAccess(
    accessToken: string,
    documentId: string
  ): Promise<[boolean, ICollaborator | null]> {
    const note = await this.noteModel.findById(documentId);
    if (!note) throw new Error('Document not found');
    // token is in req headers
    const token = await this.accessTokenModel.findById(accessToken);
    if (!token || !token.user) throw new Error('Access token not found');

    const hasPublicPermissions = isPermitted(
      note.public_permissions,
      Permission.Read
    );
    if (hasPublicPermissions) return [true, null];

    const collaborator = await this.collaboratorModel.findOne({
      type: 'note',
      note: documentId,
      user: token.user,
    });
    if (!collaborator)
      throw new Error("You don't have access to this document");

    // update last viewed at
    collaborator.set({
      last_viewed_at: new Date(),
    });
    collaborator.save();
    return [true, collaborator as ICollaborator];
  }

  async getEditorSockets(documentId: string): Promise<WebSocket[]> {
    return this.socketRepository.getEditorSockets(documentId);
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
    if (!this.socketRepository.socketIsEditor(documentId, editor))
      throw new Error('You are not an editor of this document');
    return this.socketRepository.setContent(documentId, content, editor);
  }

  async getContent(documentId: string): Promise<string>;
  async getContent(documentId: string, editor?: WebSocket): Promise<string> {
    if (editor && !this.socketRepository.socketIsEditor(documentId, editor))
      throw new Error('You are not an editor of this document');
    return this.socketRepository.getContent(documentId);
  }

  async removeDocumentFromMemory(documentId: string) {
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
  async saveContentToDisk(documentId: string, editor?: WebSocket) {
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
