import WebSocket, { Data } from "ws";
import { SocketRepository } from "./socket.repository";

export class SocketService {
  private socketRepository: SocketRepository;

  constructor() {
    this.socketRepository = new SocketRepository();
  }

  //handleJoin
  //handleLeave
  //handleDocumentUpdate
  //syncWithDatabase (autosave)

  async broadcast(documentId: string, message: object) {
    const payload = JSON.stringify(message);
    const editors = await this.socketRepository.getEditors(documentId);
    editors.forEach((editor) => editor.send(payload));
  }

  async addEditorToDocument(documentId: string, editor: WebSocket) {
    return this.socketRepository.addEditor(documentId, editor);
  }

  async removeEditorFromDocument(documentId: string, editor: WebSocket) {
    return this.socketRepository.removeEditor(documentId, editor);
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





  parse(message: Data) {
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

  // handleJoin(socket: WebSocket, data: any) {
  //   const { documentId } = this.parse(data);
  //   this.socketRepository.findOrCreateDocument(documentId, {
  //     content: "",
  //     editors: [socket]
  //   });

  //   this.socketRepository.addEditor(documentId, socket);
  // }

  // handleDocumentUpdate(socket, data) {
  //   const { documentId, content } = data;
  //   const users = this.documents.get(documentId);

  //   if (!users) return;

  //   // Update the document in Redis
  //   redisClient.set(`document:${documentId}`, content);

  //   // Broadcast the update to all connected users
  //   const updateMessage = JSON.stringify({ type: 'update', content });
  //   users.forEach((user) => {
  //     if (user !== socket) {
  //       user.send(updateMessage);
  //     }
  //   });
  // }

  // syncWithDatabase() {
  //   setInterval(async () => {
  //     for (const [documentId, _] of this.documents) {
  //       const content = await this.getContentFromRedis(documentId);
  //       await this.updateDocumentInDatabase(documentId, content);
  //     }
  //   }, 10000);
  // }

  // getContentFromRedis(documentId) {
  //   return new Promise((resolve, reject) => {
  //     redisClient.get(`document:${documentId}`, (err, content) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(content);
  //       }
  //     });
  //   });
  // }

  // async updateDocumentInDatabase(documentId, content) {
  //   try {
  //     await Document.findOneAndUpdate(
  //       { _id: documentId },
  //       { content },
  //       { upsert: true, new: true }
  //     );
  //   } catch (err) {
  //     console.error('Error updating document in MongoDB:', err);
  //   }
  // }

}