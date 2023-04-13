import { useEffect, useState } from "react";

export const useQuizTimer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}