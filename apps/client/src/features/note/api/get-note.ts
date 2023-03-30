import { useQuery } from 'react-query';
import axios from 'axios';

const fetchNote = async (noteId) => {
  const response = await axios.get(`/api/v1/notes/${noteId}`);
  return response.data;
};

export const useGetNote = (noteId) => {
  return useQuery(['note', noteId], () => fetchNote(noteId), {
    enabled: !!noteId,
  });
};
