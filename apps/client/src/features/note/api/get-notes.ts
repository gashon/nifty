import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { NoteListResponse } from '@nifty/server-lib/models/note';
import { PaginationParams } from '@nifty/api/types';
import { axios } from '@/lib/axios';

export const getNotes = async (directoryId: string | undefined, { sort, limit, page, expand }: PaginationParams, headers?: { [key: string]: string }): Promise<{ data: NoteListResponse }> => {
  const { data } = await axios.get(`/api/v1/notes`, {
    params: {
      directory_id: directoryId,
      sort,
      limit,
      page,
      expand
    },
    headers
  });
  return data;
};

type UseNotesOptions = PaginationParams & {
  directoryId?: string;
};

export const useInfiniteNotes = ({ page, directoryId, ...pagination }: UseNotesOptions, initialData?: InfiniteData<NoteListResponse>): UseInfiniteQueryResult<NoteListResponse> => {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = (page || 1) }) => {
      return new Promise((resolve, reject) => {
        getNotes(directoryId, { ...pagination, page: pageParam })
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
        return lastPage.page + 1;
      }
    },
    initialData,
    enabled: !initialData,
  });
};

