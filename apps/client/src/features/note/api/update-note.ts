import { NoteUpdateRequest } from '@nifty/server-lib/models/note';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { NoteUpdateResponse } from "@nifty/api/domains/note/types"

export const updateNote = (noteId: string, data: NoteUpdateRequest): Promise<AxiosResponse<NoteUpdateResponse>> => {
  return axios.patch(`/api/v1/notes/${noteId}`, data);
};

type UseUpdateModuleOptions = {
  config?: MutationConfig<typeof updateNote>;
};

export const useUpdateNote = (noteId: string, { config }: UseUpdateModuleOptions = {}): ReturnType<typeof useMutation> => {
  return useMutation(
    ["note", noteId], // mutationKey
    (payload: NoteUpdateRequest) => updateNote(noteId, payload as NoteUpdateRequest), // mutationFn
    {
      onSuccess: (data: AxiosResponse<NoteUpdateResponse, any>, variables: NoteUpdateRequest | string, context: unknown) => {
        const updatedNote = data.data;

        queryClient.setQueryData<any>(["note", noteId], (previousModule) => {
          return {
            ...previousModule,
            ...updatedNote,
          };
        }
        );
        // queryClient.invalidateQueries(["note", noteId]);
      },
      ...config,
    }
  );
};
