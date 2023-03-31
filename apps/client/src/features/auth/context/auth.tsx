import * as z from 'zod';
import React, { FC, createContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import storage from '@/lib/storage';
import { getUser, emailLogin, LoginFormSchema, signOut } from '@/features/auth';
import { IUser } from '@nifty/server-lib/models/user';

type AuthUserDTO = IUser | null;

type AuthContextType = {
  user: AuthUserDTO | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isOffline: boolean;
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
  onMagicLinkLogin: (values: z.infer<typeof LoginFormSchema>) => Promise<AxiosResponse<any, any>>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  preloadedUser?: AuthUserDTO;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children, preloadedUser }) => {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState<boolean | undefined>(false);
  const [user, setUser] = useState<AuthUserDTO | undefined>(preloadedUser);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (user) return;
    // check if user is persisted
    const persistedUser = storage.get<AuthUserDTO | undefined>('user');

    // check if user has access token
    // * FIXME - clean this up and make it more readable
    if (document.cookie.includes('access_token')) {
      // fetch user data
      getUser()
        .then(({ data, status }) => {
          if (status !== 200) {
            setError(new Error('Failed to fetch user data'));
            return;
          }
          storage.set<IUser>('user', data);
          setUser(data);
          setIsOffline(false);
        })
        .catch(err => {
          if (err.message === 'Network Error' && persistedUser) {
            setIsOffline(true);
            return;
          }
          setError(err);
          setIsOffline(false);
        });
      return;
    }

    if (persistedUser) {
      setUser(persistedUser);
      setIsOffline(true);
      return;
    }

    setError(new Error('User is not logged in'));
    setUser(null);
  }, []);

  const onGithubLogin = useCallback(() => {
    window.location.href = '/ajax/auth/login/github';
  }, []);

  const onGoogleLogin = useCallback(() => {
    const redirect = (router.query.redirect as string) || '/dashboard';
    window.location.href = `/ajax/auth/login/google?${new URLSearchParams({
      ...router.query,
      redirect,
    }).toString()}`;
  }, [router]);

  const onMagicLinkLogin = useCallback(
    async (values: z.infer<typeof LoginFormSchema>) => {
      return emailLogin({ email: values.email }, router.query);
    },
    [router.query]
  );

  const logout = useCallback(async () => {
    // always remove user from local before destroying cookie (otherwise we mis-detect offlineMode)
    storage.remove('user');
    await signOut();
    window.location.href = '/auth';
  }, []);

  const value = {
    user,
    error,
    isOffline,
    isLoading: user === undefined,
    onMagicLinkLogin,
    onGithubLogin,
    onGoogleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
