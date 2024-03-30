import { useQuery } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import type { GetUserNotesResponse } from '@nifty/api/domains/note/dto';

export const getRecentlyEditedNotes = async (headers?: {
  [key: string]: string;
}): Promise<GetUserNotesResponse> => {
  const { data } = await axios.get(`/api/v1/notes`, {
    params: {
      limit: 100,
      orderBy: 'note.updatedAt desc',
    },
    headers,
  });
  return data;
};

export const useRecentNotes = (userId: number) => {
  return useQuery(['recent-notes', userId], () => getRecentlyEditedNotes(), {
    enabled: true,
  });
};
