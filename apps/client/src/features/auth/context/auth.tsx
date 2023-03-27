import * as z from 'zod';
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import storage from '@/lib/storage';
import { getUser, emailLogin, LoginFormSchema } from '@/features/auth';
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

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean | undefined>(false);
  const [user, setUser] = useState<AuthUserDTO | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (user) return;
    // check if user is persisted
    const persistedUser = storage.get<AuthUserDTO | undefined>('user');

    // check if user has access token
    // * FIXME - clean this up and make it more readable
    if (document.cookie.includes('access_token')) {
      // fetch user data
      setIsLoading(true);
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
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }

    if (persistedUser) {
      setUser(persistedUser);
      setIsOffline(true);
      setIsLoading(false);
      return;
    }

    setError(new Error('User is not logged in'));
    setUser(null);
    setIsLoading(false);
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
    async (values: z.infer<typeof LoginFormSchema>) => {
      return emailLogin({ email: values.email }, router.query);
    },
    [router.query]
  );

  const logout = useCallback(() => {
    // always remove user from local before destroying cookie (otherwise we mis-detect offlineMode)
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
