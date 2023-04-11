import { useEffect, useCallback } from 'react';
import { SOCKET_EVENT } from '@nifty/api-live/types';
import { Descendant } from 'slate';

type SocketMessageHandlerParams = {
  socket: WebSocket | null;
  documentId: string;
  onDocumentLoad: (note: any) => void;
};

export const useSocketMessageHandler = ({
  socket,
  documentId,
  onDocumentLoad,
}: SocketMessageHandlerParams): void => {
  useEffect(() => {
    if (socket) {
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.event === SOCKET_EVENT.DOCUMENT_LOAD) {
          const { note } = data.payload;
          if (note.id === documentId) {
            onDocumentLoad(note);
          }
        } else if (data.event === SOCKET_EVENT.EDITOR_PING) {
          socket.send(
            JSON.stringify({
              event: SOCKET_EVENT.EDITOR_PONG,
              payload: {},
            })
          );
        }
        // todo implement collaboration
        // if (data.event === SOCKET_EVENT.DOCUMENT_UPDATE) {
        // ...
        // }
      };
    }
  }, [socket, documentId, onDocumentLoad]);
};
