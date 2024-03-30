import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import type {
  CreateDirectoryResponse,
  CreateDirectoryRequestBody,
  GetDirectoriesResponse,
} from '@nifty/api/domains/directory/dto';

export const createModule = (
  data: CreateDirectoryRequestBody
): Promise<AxiosResponse<CreateDirectoryResponse>> => {
  return axios.post(`/api/v1/directories`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof createModule>;
};

type InfiniteQueryData = {
  pages: GetDirectoriesResponse[];
  pageParams: Array<string | undefined>;
};

export const useCreateModule = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onSuccess: async (newDirectory) => {
      await queryClient.cancelQueries('directories');

      const previousModules: InfiniteQueryData =
        queryClient.getQueryData('directories');

      queryClient.setQueryData(['directories'], () => ({
        ...previousModules,
        pages: [
          {
            ...previousModules.pages[0],
            data: [newDirectory.data.data, ...previousModules.pages[0].data],
          },
          ...previousModules.pages.slice(1),
        ],
      }));
      return { previousModules };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('directories', context.previousModules);
      }
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries('directories');
    // },
    ...config,
    mutationFn: createModule,
  });
};
