import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from 'react-query';

import { PaginationParams } from '@nifty/api/types';
import { axios } from '@nifty/client/lib/axios';
import { GetDirectoryNotesResponse } from '@nifty/api/domains/note/dto';

export const getNotes = async (
  directoryId: string | undefined,
  params: PaginationParams<'note'>,
  headers?: { [key: string]: string }
): Promise<GetDirectoryNotesResponse> => {
  const { data } = await axios.get(`/api/v1/notes/directories/${directoryId}`, {
    params,
    headers,
  });
  return data;
};

type UseNotesOptions = PaginationParams<'note'> & {
  directoryId?: string;
};

export const useInfiniteNotes = (
  { cursor, directoryId, ...pagination }: UseNotesOptions,
  initialData?: InfiniteData<GetDirectoryNotesResponse>
): UseInfiniteQueryResult<GetDirectoryNotesResponse> => {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = cursor ?? null }) => {
      return new Promise((resolve, reject) => {
        getNotes(directoryId, { ...pagination, cursor: pageParam })
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
