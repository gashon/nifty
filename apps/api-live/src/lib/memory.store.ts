import { WebSocket } from "ws";

export type Document = {
  editors: WebSocket[]
  content: string
}

type StoreType = {
  [documentId: string]: Document
}

export class InMemoryStore {
  private static instance: InMemoryStore;
  public store: StoreType;

  constructor() {
    if (InMemoryStore.instance) {
      this.store = InMemoryStore.instance.store;
      return InMemoryStore.instance;
    }

    this.store = {}
    InMemoryStore.instance = this;
  }

  setDocument(documentId: string, data: any) {
    this.store[documentId] = data;
    
    return this.store[documentId]
  }

  getDocument(documentId: string): Document {
    return this.store[documentId];
  }

  addEditor(documentId: string, editor: WebSocket) {
    this.store[documentId].editors.push(editor);
  }

  removeEditor(documentId: string, editor: WebSocket) {
    this.store[documentId].editors = this.store[documentId].editors.filter(e => e !== editor);
  }

  updateContent(documentId: string, content: string) {
    this.store[documentId].content = content;
  }

  getContent(documentId: string): string {
    return this.store[documentId].content;
  }

  getEditors(documentId: string): WebSocket[] {
    return this.store[documentId].editors;
  }

  hasDocument(documentId: string): boolean {
    return !!this.store[documentId];
  }

  hasEditor(documentId: string, editor: WebSocket): boolean {
    return this.store[documentId].editors.includes(editor);
  }

  getDocuments(): string[] {
    return Object.keys(this.store);
  }

  getDocumentCount(): number {
    return Object.keys(this.store).length;
  }
}