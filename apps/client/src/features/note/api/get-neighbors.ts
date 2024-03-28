import { useQuery } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import type { GetNoteNeighborsRequestQuery } from '@nifty/api/domains/note/dto';

const fetchNoteNeighbors = async (
  noteId: string,
  params: GetNoteNeighborsRequestQuery
) => {
  try {
    const response = await axios.get(`/api/v1/notes/${noteId}/neighbors`, {
      params,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const useGetNoteNeighbors = (
  noteId,
  query: GetNoteNeighborsRequestQuery
) => {
  return useQuery(
    ['note', 'neighbors', noteId],
    () => fetchNoteNeighbors(noteId, query),
    {
      enabled: !!noteId,
    }
  );
};
