import { WebSocket } from "ws";
import { InMemoryStore } from "@/lib/memory.store";

export class SocketRepository {
  private store: InMemoryStore;

  constructor() {
    this.store = new InMemoryStore();
  }

  findDocumentById(id: string) {
    return this.store.getDocument(id);
  }

  findOrCreateDocument(id: string, data: any) {
    if (this.store.hasDocument(id)) return this.store.getDocument(id);
    return this.store.setDocument(id, { editors: [], content: "", ...data });
  }

  updateDocument(id: string, data: any) {
    this.store.setDocument(id, data);
    return data;
  }

  addEditor(id: string, editor: WebSocket) {
    this.store.addEditor(id, editor);
  }

  removeEditor(id: string, editor: WebSocket) {
    this.store.removeEditor(id, editor);
  }

  getEditors(id: string) {
    return this.store.getEditors(id);
  }

  updateContent(id: string, content: string) {
    this.store.updateContent(id, content);
  }


}