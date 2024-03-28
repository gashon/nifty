import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from 'react-query';

import { NoteListResponse } from '@nifty/server-lib/models/note';
import { PaginationParams } from '@nifty/api/types';
import { axios } from '@nifty/client/lib/axios';

export const getNotes = async (
  directoryId: string | undefined,
  { sort, limit, cursor, expand }: PaginationParams,
  headers?: { [key: string]: string }
): Promise<{ data: NoteListResponse }> => {
  const { data } = await axios.get(`/api/v1/notes/directories/${directoryId}`, {
    params: {
      sort,
      limit,
      cursor,
      expand,
    },
    headers,
  });
  return data;
};

type UseNotesOptions = PaginationParams & {
  directoryId?: string;
};

export const useInfiniteNotes = (
  { cursor, directoryId, ...pagination }: UseNotesOptions,
  initialData?: InfiniteData<NoteListResponse>
): UseInfiniteQueryResult<NoteListResponse> => {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = cursor }) => {
      return new Promise((resolve, reject) => {
        getNotes(directoryId, { ...pagination, cursor: pageParam })
          .then(({ data }) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.has_more) {
        return lastPage.next_cursor;
      }
    },
    initialData,
    enabled: !initialData,
  });
};
