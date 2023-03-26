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
  isLoading: boolean;
  error: Error | undefined;
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
  onMagicLinkLogin: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(undefined);
const UserContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUserDTO | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (user) return;

    // check if user is persisted
    const persistedUser = storage.get<AuthUserDTO | undefined>('user');
    if (persistedUser) return setUser(persistedUser);

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
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return;
  });

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
    window.location.href = '/ajax/auth/logout';
    storage.remove('user');
  }, []);

  const value = { user, onMagicLinkLogin, onGithubLogin, onGoogleLogin, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* Provide user data and loading state to UserContext */}
      <UserContext.Provider value={{ user, isLoading, error }}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};