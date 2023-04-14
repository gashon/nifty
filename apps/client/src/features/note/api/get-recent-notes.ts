import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';
import { NoteDocument } from '@nifty/server-lib/models/note';

export const getRecentlyEditedNotes = async (headers?: { [key: string]: string }): Promise<{ data: Partial<NoteDocument>[] }> => {
  const { data } = await axios.get(`/api/v1/notes/recent`, {
    headers
  });
  return data;
};

export const useRecentNotes = (userId: string) => {
  return useQuery(['recent-notes', userId], () => getRecentlyEditedNotes(), {
    enabled: true,
  });
}