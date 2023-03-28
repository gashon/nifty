import { IDirectory, DirectoryCreateRequest } from '@nifty/server-lib/models/directory';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { DirectoryCreateResponse } from "@nifty/api/domains/directory/types"

export const createModule = (data: DirectoryCreateRequest): Promise<AxiosResponse<DirectoryCreateResponse>> => {
  return axios.post(`/api/v1/directories`, data);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof createModule>;
};

export const useCreateModule = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (newDirectory) => {
      await queryClient.cancelQueries('directories');

      const previousModules = queryClient.getQueryData<IDirectory[]>('directories');

      queryClient.setQueryData('directories', [...(previousModules || []), newDirectory]);

      return { previousModules };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('modules', context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('modules');
    },
    ...config,
    mutationFn: createModule,
  });
};
