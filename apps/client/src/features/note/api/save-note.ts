import { NoteListResponse, NoteUpdateRequest } from '@nifty/server-lib/models/note';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { NoteUpdateResponse } from "@nifty/api/domains/note/types"

export const updateNote = ({ note_id, ...data }: NoteUpdateRequest & { note_id: string }): Promise<AxiosResponse<NoteUpdateResponse>> => {
  return axios.post(`/api/v1/notes/${note_id}`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof updateNote>;
};

type InfiniteQueryData = {
  pages: NoteListResponse[];
  pageParams: Array<string | undefined>;
}

export const useUpdateNote = (noteId: string, { config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (newNote) => {
      await queryClient.cancelQueries(['note', noteId]);

      const previousModules: InfiniteQueryData = queryClient.getQueryData(['note', noteId]);

      queryClient.setQueryData(['note', noteId], () => (newNote));
      return { previousModules };
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
