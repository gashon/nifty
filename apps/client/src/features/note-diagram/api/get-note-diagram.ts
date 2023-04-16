import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';

export const createNoteDiagram = async (noteId: string) => {
  const { data } = await axios.get(`api/v1/notes/${noteId}/diagram`);
  return data;
}

export const useGetNoteDiagram = (noteId: string) => {
  return useQuery(['note-diagram', noteId], () => createNoteDiagram(noteId), {
    enabled: !!noteId,
  });
}