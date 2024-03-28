import {
  NoteListResponse,
  NoteCreateRequest,
} from '@nifty/server-lib/models/note';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import { NoteCreateResponse } from '@nifty/api/domains/note/types';
import type { CreateNoteRequestBody } from '@nifty/api/domains/note/dto';

export const createNote = (
  data: CreateNoteRequestBody
): Promise<AxiosResponse<NoteCreateResponse>> => {
  return axios.post(`/api/v1/notes`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof createNote>;
};

type InfiniteQueryData = {
  pages: NoteListResponse[];
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
      const createdNote = noteCreateResponse.data.data;
      queryClient.setQueryData<InfiniteQueryData>(
        'notes',
        (previousModules) => {
          if (previousModules?.pages?.length > 0) {
            return {
              ...previousModules,
              pages: [
                {
                  ...previousModules.pages[0],
                  data: [createdNote, ...previousModules.pages[0]],
                },
                ...previousModules.pages.slice(1),
              ],
            };
          } else {
            return { pages: [{ data: [createdNote] }], pageParams: [] };
          }
        }
      );
      queryClient.invalidateQueries('notes');
    },
    ...config,
    mutationFn: createNote,
  });
};
