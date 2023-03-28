export enum SOCKET_EVENT {
  EDITOR_CONNECT = 'editor:connect',
  EDITOR_DISCONNECT = 'editor:disconnect',
  EDITOR_JOIN = 'editor:join',
  EDITOR_LEAVE = 'editor:leave',
  DOCUMENT_UPDATE = 'document:update',
  DOCUMENT_GET = 'document:get',
  DOCUMENT_SAVE = 'document:save',
  EDITOR_ERROR = 'error',
}