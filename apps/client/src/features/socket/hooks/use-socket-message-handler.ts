import { useEffect, useCallback } from 'react';
import { SOCKET_EVENT } from '@nifty/api-live/types';

type SocketMessageHandlerParams = {
  socket: WebSocket | null;
  documentId: number;
  onDocumentLoad: (note: any) => void;
  onDocumentUpdate: (note: any) => void;
};

export const useSocketMessageHandler = ({
  socket,
  documentId,
  onDocumentLoad,
  onDocumentUpdate,
}: SocketMessageHandlerParams) => {
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
        } else if (data.event === SOCKET_EVENT.DOCUMENT_UPDATE) {
          const { note } = data.payload;
          if (note.id === documentId) {
            onDocumentUpdate(note);
          }
        }
      };
    }
  }, [socket, documentId, onDocumentLoad]);

  const sendDocumentUpdate = useCallback(
    (noteContent: string, operation: any) => {
      if (socket) {
        socket.send(
          JSON.stringify({
            event: SOCKET_EVENT.DOCUMENT_UPDATE,
            payload: {
              note: {
                id: documentId,
                content: noteContent,
                operation,
              },
            },
          })
        );
      }
    },
    [socket]
  );

  return { sendDocumentUpdate };
};
