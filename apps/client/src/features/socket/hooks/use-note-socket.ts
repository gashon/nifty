
import { useEffect, useState, useRef, useReducer } from 'react';
import { v4 as uuidv4 } from "uuid";

export const useNoteSocket = (noteId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnect, forceReconnect] = useReducer((x) => x + 1, 0);
  const id = useRef(uuidv4());

  useEffect(() => {
    if (!noteId) return;

    const s = new WebSocket(`ws://localhost:8080/${noteId}`);

    s.onopen = () => {
      console.log('socket opened');
    };
    // on error, attempt to reconnect
    s.onerror = (error) => {
      // attempt to reconnect
      s.close();

      if (reconnect < 5) {
        forceReconnect();
      }
    };


    setSocket(s);
    // return () => {
    //   s.close();
    // };
  }, [noteId, reconnect]);

  return [socket];
}