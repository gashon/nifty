import { useQuery, UseQueryResult } from 'react-query';

import { getUser } from '@/features/auth/api';
import { ReactQueryResponse } from '@/features/auth/types';
import { IUser } from '@api/lib/models/user';

export default function useUser(): ReactQueryResponse<IUser> {
  return useQuery('user', async () => await getUser());
};
