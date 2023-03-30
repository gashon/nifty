import { NoteListResponse, NoteUpdateRequest } from '@nifty/server-lib/models/note';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { NoteUpdateResponse } from "@nifty/api/domains/note/types"

export const updateNote = ({ note_id, ...data }: NoteUpdateRequest & { note_id: string }): Promise<AxiosResponse<NoteUpdateResponse>> => {
  return axios.patch(`/api/v1/notes/${note_id}`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof updateNote>;
};

export const useUpdateNote = (noteId: string, { config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (newNote) => {

    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(['note', noteId], context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['note', noteId]);
    },
    ...config,
    mutationFn: updateNote,
  });
};
