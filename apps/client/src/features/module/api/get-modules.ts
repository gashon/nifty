import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { DirectoryListResponse } from '@nifty/server-lib/models/directory';
import { PaginationParams } from '@nifty/api/types';
import { axios } from '@nifty/client/lib/axios';

export const getDirectories = async ({ sort, limit, page, expand }: PaginationParams): Promise<DirectoryListResponse> => {
  const { data } = await axios.get(`/api/v1/directories`, {
    params: {
      sort,
      limit,
      page,
      expand
    },
  });
  return data;
};

type UseDirectoriesOptions = PaginationParams;

export const useInfiniteDirectories = ({ ...pagination }: UseDirectoriesOptions): UseInfiniteQueryResult<PaginationParams> => {
  return useInfiniteQuery({
    queryKey: ['directories'],
    queryFn: ({ pageParam = 1 }) => getDirectories({ ...pagination, page: pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.has_more) {
        return lastPage.page + 1;
      }
    },
  });
};

