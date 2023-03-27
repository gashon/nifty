import { useEffect, FC, ReactElement } from 'react';
import { useAuth } from '@/features/auth';

type AuthProtectionProps = {
  children: ReactElement;
  loadingComponent: ReactElement;
};

export const AuthProtection: FC<AuthProtectionProps> = ({ children, loadingComponent }) => {
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

  if (isLoading || user === null) return loadingComponent;

  return <>{children}</>;
};
