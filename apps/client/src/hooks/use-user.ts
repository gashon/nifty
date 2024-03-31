import { useQuery, UseQueryResult } from 'react-query';

import { getUser } from '@nifty/client/features/auth/api';
import { ReactQueryResponse } from '@nifty/client/features/auth/types';
import type { Selectable, User } from '@nifty/common/types';

export function useUser(): ReactQueryResponse<Selectable<User>> {
  return useQuery('user', async () => {
    const { data } = await getUser();
    return data.data;
  });
}

export default useUser;
