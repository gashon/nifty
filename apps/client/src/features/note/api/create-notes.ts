import { NoteListResponse, NoteCreateRequest } from '@nifty/server-lib/models/note';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { NoteCreateResponse } from "@nifty/api/domains/note/types"

export const createNote = (data: NoteCreateRequest): Promise<AxiosResponse<NoteCreateResponse>> => {
  return axios.post(`/api/v1/notes`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof createNote>;
};

type InfiniteQueryData = {
  pages: NoteListResponse[];
  pageParams: Array<string | undefined>;
}

export const useCreateNote = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (newNote) => {
      await queryClient.cancelQueries('notes');

      const previousModules: InfiniteQueryData = queryClient.getQueryData('notes');

      queryClient.setQueryData(['notes'], () => (
        {
          ...previousModules,
          pages: previousModules?.pages?.length > 0 ? [
            {
              ...previousModules.pages[0],
              data: [
                newNote,
                ...previousModules.pages[0].data,
              ],
            },
            ...previousModules.pages.slice(1),
          ] : [{ data: newNote }],
        }
      ));
      return { previousModules };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('notes', context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('notes');
    },
    ...config,
    mutationFn: createNote,
  });
};
