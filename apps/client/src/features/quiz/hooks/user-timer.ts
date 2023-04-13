import { useEffect, useState } from "react";
import storage from "@/lib/storage";

interface TimeSession {
  start_time: number;
  end_time: number;
  quiz_id: string;
}

export const useQuizSession = (quizId: string) => {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<TimeSession | null>(null);
  const storageKey = `quiz_sessions:${quizId}`;

  useEffect(() => {
    // load all sessions from local storage
    const sessions = storage.get<TimeSession[]>(storageKey) ?? [];
    setSessions(sessions);
  }, []);

  useEffect(() => {
    // save all sessions to local storage
    storage.set(storageKey, sessions);
  }, [sessions]);

  useEffect(() => {
    // load the current session from local storage
    const session = storage.get<TimeSession>(storageKey) ?? null;
    setCurrentSession(session);
  }, []);

  useEffect(() => {
    // save the current session to local storage
    storage.set(storageKey, currentSession);
  }, [currentSession]);

  const getTotalTime = () => {
    const totalTime = sessions.reduce((total, session) => {
      return total + (session.end_time - session.start_time);
    }, 0);
    return totalTime;
  }

  const startSession = () => {
    const session: TimeSession = {
      start_time: Date.now(),
      end_time: Date.now(),
      quiz_id: quizId
    };
    setCurrentSession(session);
  }

  const endSession = () => {
    if (!currentSession) return;
    const session = {
      ...currentSession,
      end_time: Date.now(),
    };
    setSessions([...sessions, session]);
    setCurrentSession(null);
  }

  return {
    getTotalTime,
    startSession,
    endSession,
  };

}