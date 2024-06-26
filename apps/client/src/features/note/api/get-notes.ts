import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from 'react-query';

import { PaginationParams } from '@nifty/api/types';
import { axios } from '@nifty/client/lib/axios';
import {
  GetDirectoryNotesResponse,
  GetUserNotesRequestQuery,
} from '@nifty/api/domains/note/dto';

export const getNotes = async (
  params: GetUserNotesRequestQuery,
  headers?: { [key: string]: string }
): Promise<GetDirectoryNotesResponse> => {
  const { data } = await axios.get(`/api/v1/notes`, {
    params,
    headers,
  });
  return data;
};

export const useInfiniteNotes = (
  { cursor, ...pagination }: GetUserNotesRequestQuery,
  initialData?: InfiniteData<GetDirectoryNotesResponse>
): UseInfiniteQueryResult<GetDirectoryNotesResponse> => {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = cursor ?? null }) => {
      return new Promise((resolve, reject) => {
        getNotes({ ...pagination, cursor: pageParam })
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
