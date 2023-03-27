import { useEffect } from 'react';
import { useAuth } from '@/features/auth';

export const AuthProtection = ({ children, LoadingComponent }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user === null) {
      window.location.replace(
        `/error/external?message=${encodeURIComponent(
          'You are not logged in!'
        )}&redirect=${encodeURIComponent(location.pathname + location.search)}`
      );
    }
  }, [user, isLoading]);

  if (isLoading || user === null) return LoadingComponent;

  return <>{children}</>;
};
