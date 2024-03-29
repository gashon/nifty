import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import type {
  CreateNoteResponse,
  CreateNoteRequestBody,
  GetUserNotesResponse,
} from '@nifty/api/domains/note/dto';

export const createNote = (
  data: CreateNoteRequestBody
): Promise<AxiosResponse<CreateNoteResponse>> => {
  return axios.post(`/api/v1/notes`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof createNote>;
};

type InfiniteQueryData = {
  pages: GetUserNotesResponse[];
  pageParams: Array<string | undefined>;
};

export const useCreateNote = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (newNote) => {
      await queryClient.cancelQueries('notes');
      return { previousModules: queryClient.getQueryData('notes') };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('notes', context.previousModules);
      }
    },
    onSuccess: (noteCreateResponse) => {
      queryClient.invalidateQueries('notes');
    },
    ...config,
    mutationFn: createNote,
  });
};
