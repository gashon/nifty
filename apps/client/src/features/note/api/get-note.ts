import { useQuery } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import type { GetNoteResponse } from '@nifty/api/domains/note/dto';
import { AxiosResponse } from 'axios';

export const getNote = async (
  noteId,
  headers?: { [key: string]: string }
): Promise<AxiosResponse<GetNoteResponse>> => {
  const response = await axios.get(`/api/v1/notes/${noteId}`, {
    headers,
  });
  return response.data;
};

export const useGetNote = (noteId: number) => {
  return useQuery(['note', noteId], () => getNote(noteId), {
    enabled: !!noteId,
  });
};
