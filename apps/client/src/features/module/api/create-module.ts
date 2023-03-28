import { DirectoryListResponse, DirectoryCreateRequest } from '@nifty/server-lib/models/directory';
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

type InfiniteQueryData = {
  pages: DirectoryListResponse[];
  pageParams: Array<string | undefined>;
}

export const useCreateModule = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (newDirectory) => {
      await queryClient.cancelQueries('directories');

      const previousModules: InfiniteQueryData = queryClient.getQueryData('directories');

      // queryClient.setQueryData(['directories'], () => (
      //   {
      //     ...previousModules,
      //     pages: [
      //       {
      //         ...previousModules.pages[0],
      //         data: [
      //           newDirectory,
      //           ...previousModules.pages[0].data,
      //         ],
      //       },
      //       ...previousModules.pages.slice(1),
      //     ],
      //   }
      // ));
      return { previousModules };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('directories', context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('directories');
    },
    ...config,
    mutationFn: createModule,
  });
};
