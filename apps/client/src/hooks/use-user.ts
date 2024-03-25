import { useQuery, UseQueryResult } from 'react-query';

import { getUser } from '@nifty/client/features/auth/api';
import { ReactQueryResponse } from '@nifty/client/features/auth/types';
import { IUser } from '@api/lib/models/user';

export default function useUser(): ReactQueryResponse<IUser> {
  return useQuery('user', async () => await getUser());
};
