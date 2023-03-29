export enum SOCKET_EVENT {
  EDITOR_JOIN = 'editor:join',
  EDITOR_LEAVE = 'editor:leave',
  EDITOR_IDLE = 'editor:idle',
  DOCUMENT_UPDATE = 'document:update',
  DOCUMENT_GET = 'document:get',
  DOCUMENT_SAVE = 'document:save',
  DOCUMENT_LOAD = 'document:load',
  ERROR = 'error'
}