import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';
import { INote } from "@nifty/server-lib/models/note";
import { AxiosResponse } from 'axios';

export const getNote = async (noteId, headers?: { [key: string]: string }): Promise<AxiosResponse<INote>> => {
  try {
    const response = await axios.get(`/api/v1/notes/${noteId}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    return null;
  }
};

export const useGetNote = (noteId) => {
  return useQuery(['note', noteId], () => getNote(noteId), {
    enabled: !!noteId,
  });
};
