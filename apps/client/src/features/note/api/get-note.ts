import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';

const fetchNote = async (noteId) => {
  try {
    const response = await axios.get(`/api/v1/notes/${noteId}`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const useGetNote = (noteId) => {
  return useQuery(['note', noteId], () => fetchNote(noteId), {
    enabled: !!noteId,
  });
};
