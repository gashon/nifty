import { WebSocket } from "ws";

export type Document = {
  editors: WebSocket[],
  content: string,
}

export type Store = {
  [documentId: string]: Document
}