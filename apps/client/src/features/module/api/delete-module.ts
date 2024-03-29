import { DirectoryListResponse } from '@nifty/server-lib/models/directory';
import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import { GetDirectoriesResponse } from '@nifty/api/domains/directory/dto';

export const deleteDirectory = (directoryId: number) => {
  return axios.delete(`/api/v1/directories/${directoryId}`);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof deleteDirectory>;
};

export const useDeleteModule = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries('directories');

      // delete the directory from the cache
      const previousModules: GetDirectoriesResponse =
        queryClient.getQueryData('directories');
      queryClient.setQueryData('directories', () => ({
        ...previousModules,
        data: (previousModules?.data || []).filter(
          (dir) => dir.id !== deletedId
        ),
      }));

      return { previousModules };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('directories', context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('directories');
      queryClient.invalidateQueries('recent-directories');
      // invalidate notes which may have been moved to the trash
      queryClient.invalidateQueries('notes');
      queryClient.invalidateQueries('recent-notes');
    },
    ...config,
    mutationFn: (directoryId) => deleteDirectory(directoryId),
  });
};
