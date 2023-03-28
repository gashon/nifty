import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { NoteListResponse } from '@nifty/server-lib/models/note';
import { PaginationParams } from '@nifty/api/types';
import { axios } from '@/lib/axios';

export const getNotes = async (directoryId: string, { sort, limit, page, expand }: PaginationParams): Promise<NoteListResponse> => {
  const { data } = await axios.get(`/api/v1/notes`, {
    params: {
      directory_id: directoryId,
      sort,
      limit,
      page,
      expand
    },
  });
  return data;
};

type UseNotesOptions = PaginationParams & {
  directoryId: string;
};

export const useInfiniteNotes = ({ directoryId, ...pagination }: UseNotesOptions): UseInfiniteQueryResult<PaginationParams> => {
  return useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam = 1 }) => getNotes(directoryId, { ...pagination, page: pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.has_more) {
        return lastPage.page + 1;
      }
    },
  });
};

