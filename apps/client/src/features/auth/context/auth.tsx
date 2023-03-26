import * as z from 'zod';
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import storage from '@/lib/storage';
import {
  getUser,
  emailLogin,
  LoginFormSchema,
  SentStatus as EmailLoginSentStatus,
} from '@/features/auth';
import { IUser } from '@nifty/server-lib/models/user';

type AuthUserDTO = IUser | null;

type AuthContextType = {
  user: AuthUserDTO | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isOffline: boolean;
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
  onMagicLinkLogin: (
    values: { email?: string },
    setSentStatus: Dispatch<SetStateAction<EmailLoginSentStatus>>
  ) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(undefined);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUserDTO | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (user) return;
    // check if user is persisted
    const persistedUser = storage.get<AuthUserDTO | undefined>('user');

    // check if user has access token
    if (document.cookie.includes('access_token')) {
      // fetch user data
      setIsLoading(true);
      getUser()
        .then(({ data, status }) => {
          if (status !== 200) {
            setError(new Error('Failed to fetch user data'));
            return;
          }
          storage.set('user', data);
          setUser(data);
        })
        .catch(err => {
          if (err.message === 'Network Error' && persistedUser) {
            setIsOffline(true);
            return;
          }
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }

    if (persistedUser) {
      setUser(persistedUser);
      return;
    }

    setError(new Error('User is not logged in'));
  }, []);

  const onGithubLogin = useCallback(() => {
    window.location.href = '/ajax/auth/login/github';
  }, []);

  const onGoogleLogin = useCallback(() => {
    const redirect = (router.query.redirect as string) || '/d';
    window.location.href = `/ajax/auth/login/google?${new URLSearchParams({
      ...router.query,
      redirect,
    }).toString()}`;
  }, [router]);

  const onMagicLinkLogin = useCallback(
    async (
      values: z.infer<typeof LoginFormSchema>,
      setSentStatus: Dispatch<SetStateAction<EmailLoginSentStatus>>
    ) => {
      const { status } = await emailLogin({ email: values.email }, router.query);
      if (status !== 200) setSentStatus(EmailLoginSentStatus.Error);
      else setSentStatus(EmailLoginSentStatus.Sent);
    },
    [router.query]
  );

  const logout = useCallback(() => {
    storage.remove('user');
    window.location.href = '/ajax/auth/logout';
  }, []);

  const value = {
    user,
    error,
    isOffline,
    isLoading,
    onMagicLinkLogin,
    onGithubLogin,
    onGoogleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
