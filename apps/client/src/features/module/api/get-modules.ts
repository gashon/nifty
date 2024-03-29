import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import type {
  GetDirectoriesResponse,
  GetDirectoriesRequestQuery,
} from '@nifty/api/domains/directory/dto';
import { axios } from '@nifty/client/lib/axios';

export const getDirectories = async (
  params: GetDirectoriesRequestQuery
): Promise<GetDirectoriesResponse> => {
  const { data } = await axios.get(`/api/v1/directories`, {
    params,
  });
  return data;
};

export const useInfiniteDirectories = (
  pagination: GetDirectoriesRequestQuery
): UseInfiniteQueryResult<GetDirectoriesResponse> => {
  return useInfiniteQuery({
    queryKey: ['directories'],
    queryFn: ({ pageParam = undefined }) =>
      getDirectories({ ...pagination, cursor: pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.nextCursor;
      }
    },
  });
};
