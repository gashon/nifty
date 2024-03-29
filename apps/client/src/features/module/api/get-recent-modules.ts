import { useQuery } from 'react-query';

import { axios } from '@nifty/client/lib/axios';
import type {
  GetDirectoriesRequestQuery,
  GetDirectoriesResponse,
} from '@nifty/api/domains/directory/dto';

type GetRecentDirectoriesRequestQuery = Pick<
  GetDirectoriesRequestQuery,
  'limit'
>;

export const getRecentlyEditedModules = async (
  params: GetRecentDirectoriesRequestQuery,
  headers?: { [key: string]: string }
): Promise<GetDirectoriesResponse['data']> => {
  const { data } = await axios.get<GetDirectoriesResponse>(
    `/api/v1/directories`,
    {
      params: {
        limit: params.limit,
        orderBy: 'directory.updatedAt desc',
      },
      headers,
    }
  );

  return data.data;
};

export const useRecentModules = (
  userId: string,
  params: GetRecentDirectoriesRequestQuery
) => {
  return useQuery(
    ['recent-directories', userId],
    () => getRecentlyEditedModules(params),
    {
      enabled: true,
    }
  );
};
