import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from 'react-query';

import { axios } from '@nifty/client/lib/axios';
import {
  GetDirectoryNotesResponse,
  GetUserNotesRequestQuery,
} from '@nifty/api/domains/note/dto';

export const getNotesInDirectory = async (
  directoryId: number,
  params: GetUserNotesRequestQuery,
  headers?: { [key: string]: string }
): Promise<GetDirectoryNotesResponse> => {
  const { data } = await axios.get(`/api/v1/notes/directories/${directoryId}`, {
    params,
    headers,
  });
  return data;
};

type UseInfiniteNotesInDirectoryOptions = {
  directoryId: number;
} & GetUserNotesRequestQuery;

export const useInfiniteNotesInDirectory = (
  { directoryId, cursor, ...pagination }: UseInfiniteNotesInDirectoryOptions,
  initialData?: InfiniteData<GetDirectoryNotesResponse>
): UseInfiniteQueryResult<GetDirectoryNotesResponse> => {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = cursor ?? undefined }) => {
      return new Promise((resolve, reject) => {
        getNotesInDirectory(directoryId, { ...pagination, cursor: pageParam })
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.pagination?.hasMore) {
        return lastPage.pagination.nextCursor;
      }
    },
    initialData,
    enabled: !initialData,
  });
};
