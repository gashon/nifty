import { useEffect, useState, useRef, useReducer } from 'react';
import { API_LIVE_URL } from '@nifty/client/config';

export const useNoteSocket = (noteId: number) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnect, forceReconnect] = useReducer((x) => x + 1, 0);
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!noteId) return;

    const s = new WebSocket(`${API_LIVE_URL}/${noteId}`);

    s.onopen = () => {
      console.log('socket opened');
    };
    // on error, attempt to reconnect
    s.onerror = (error) => {
      // attempt to reconnect
      s.close();

      if (reconnect < 5) {
        forceReconnect();
      } else {
        if (!connectionFailed) setConnectionFailed(true);
      }
    };

    setSocket(s);
    // return () => {
    //   s.close();
    // };
  }, [noteId, reconnect]);

  return { socket, connectionFailed };
};

