import { useEffect, useState, useRef } from "react";
import storage from "@nifty/client/lib/storage";

interface TimeSession {
  start_time: number;
  end_time: number | undefined;
}

export const useQuizSession = (quizId: string) => {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const hasMounted = useRef(false);
  const storageKey = `quiz_sessions:${quizId}`;

  // Load the sessions from local storage
  useEffect(() => {
    const sessions = storage.get<TimeSession[]>(storageKey) || [];
    setSessions(sessions);
  }, [storageKey]);

  // Calculate the total time spent on the quiz
  const getTotalTime = () => {
    const totalTime = sessions.reduce((total, session) => {
      if (!session.end_time) return total;
      return total + (session.end_time - session.start_time);
    }, 0);

    const currentSession = storage.get<TimeSession>(`${storageKey}:current`);
    if (currentSession)
      return totalTime + (Date.now() - currentSession.start_time);

    return totalTime;
  }

  const startSession = () => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const session: TimeSession = {
      start_time: Date.now(),
      end_time: undefined,
    };
    storage.set<TimeSession>(`${storageKey}:current`, session); // Save the current session directly to local storage
  }

  const endSession = () => {
    const currentSession = storage.get<TimeSession>(`${storageKey}:current`);
    if (!currentSession) return;

    const session = {
      ...currentSession,
      end_time: Date.now(),
    };
    storage.set<TimeSession[]>(storageKey, [...sessions, session]); // Save the updated sessions directly to local storage
    storage.remove(`${storageKey}:current`); // Remove the current session from local storage
  }

  const endSessionRef = useRef(endSession);
  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);

  const deleteSessions = () => {
    storage.remove(storageKey);
    storage.remove(`${storageKey}:current`);
    setSessions([]);
  }

  // End the session when the user closes the tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      endSessionRef.current();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    getTotalTime,
    startSession,
    endSession: endSessionRef.current,
    deleteSessions
  };

}