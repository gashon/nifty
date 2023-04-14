import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';
import { DirectoryDocument } from '@nifty/server-lib/models/directory';

export const getRecentlyEditedModules = async (k?: number, headers?: { [key: string]: string }): Promise<{ data: Partial<DirectoryDocument>[] }> => {
  const { data } = await axios.get(`/api/v1/directories/recent`, {
    params: {
      k,
    },
    headers
  });
  return data;
};

export const useRecentModules = (userId: string, k?: number) => {
  return useQuery(['recent-directories', userId], () => getRecentlyEditedModules(k), {
    enabled: true,
  });
}