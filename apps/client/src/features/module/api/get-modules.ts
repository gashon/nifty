import { DirectoryListResponse } from '@nifty/server-lib/models/directory';
import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

export const getDirectories = (): Promise<DirectoryListResponse[]> => {
  return axios.get(`/api/v1/directories`);
};

type QueryFnType = typeof getDirectories;

type UseCommentsOptions = {
  discussionId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useComments = ({ config }: UseCommentsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['directories'],
    queryFn: () => getDirectories(),
    ...config,
  });
};