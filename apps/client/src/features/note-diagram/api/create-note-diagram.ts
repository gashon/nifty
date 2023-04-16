import { axios } from '@/lib/axios';

export const createNoteDiagram = async (noteId: string) => {
  const {data} = await axios.post(`api/v1/notes/${noteId}/diagram`);
  return data;
}