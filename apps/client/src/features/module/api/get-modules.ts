import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { DirectoryListResponse } from '@nifty/server-lib/models/directory';
import { PaginationParams } from '@nifty/api/types';
import { axios } from '@/lib/axios';

export const getDirectories = ({ sort, limit, page, expand }: PaginationParams): Promise<DirectoryListResponse> => {
  return axios.get(`/api/v1/directories`, {
    params: {
      sort,
      limit,
      page,
      expand
    },
  });
};

type UseDirectoriesOptions = PaginationParams;

export const useInfiniteDirectories = ({ ...pagination }: UseDirectoriesOptions): UseInfiniteQueryResult<PaginationParams> => {
  return useInfiniteQuery({
    queryKey: ['directories', pagination],
    queryFn: ({ pageParam = 1 }) => getDirectories({ ...pagination, page: pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.has_more) {
        return lastPage.page + 1;
      }
    },
  });
};

