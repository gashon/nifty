import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';

type NoteNeighborsQuery = {
  sort?: string;
  limit: number;
};

const fetchNoteNeighbors = async (noteId: string, { sort, limit }: NoteNeighborsQuery) => {
  try {
    const response = await axios.get(`/api/v1/notes/${noteId}/neighbors`, {
      params: {
        sort,
        limit,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const useGetNoteNeighbors = (noteId, query: NoteNeighborsQuery) => {
  return useQuery(['note', "neighbors", noteId], () => fetchNoteNeighbors(noteId, query), {
    enabled: !!noteId,
  });
};
