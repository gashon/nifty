import { useEffect } from 'react';
import { useAuth } from '@/features/auth';

export const AuthProtection = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user === null) {
      window.location.replace(
        `/error/internal?message=${encodeURIComponent(
          'You are not logged in!'
        )}&redirect=${encodeURIComponent(location.pathname + location.search)}`
      );
    }
  }, [user]);

  return <>{children}</>;
};
