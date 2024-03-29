import { useQuery, UseQueryResult } from 'react-query';

import { getUser } from '@nifty/client/features/auth/api';
import { ReactQueryResponse } from '@nifty/client/features/auth/types';
import type { User } from '@nifty/common/types';

export default function useUser(): ReactQueryResponse<User> {
  return useQuery('user', async () => await getUser());
}
