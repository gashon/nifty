
import { useEffect, useState } from 'react';

export const useNoteSocket = (noteId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    console.log("GOT", noteId)
    if (!noteId) return;

    const s = new WebSocket(`ws://localhost:8080/${noteId}`);

    //attempt to reconnect on error
    s.addEventListener('error', () => {
      s.close();
    });

    setSocket(s);
    return () => {
      s.close();
    };
  }, [noteId]);

  return socket;
}