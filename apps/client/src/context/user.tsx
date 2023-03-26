import * as z from 'zod';
import React, {
  createContext,
  FC,
  ReactNode,
  useState,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { useRouter } from 'next/router';
import storage from '@/lib/storage';
import { emailLogin, LoginFormSchema, SentStatus as EmailLoginSentStatus } from '@/features/auth';
import { IUser } from '@nifty/server-lib/models/user';

type AuthUserDTO = IUser | null;
type UserContextType = {
  user: AuthUserDTO | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

const UserContext = createContext<UserContextType>(undefined);

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<AuthUserDTO | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  return <UserContext.Provider value={{ user, isLoading, error }}>{children}</UserContext.Provider>;
};
