import { AxiosResponse } from 'axios';
import { axios } from '@/lib/axios';
import { DirectoryCreateRequest, IDirectory } from '@nifty/server-lib/models/directory';


export const createModule = async (payload: DirectoryCreateRequest): Promise<AxiosResponse<IDirectory>> => {
  return axios.post<IDirectory>('/api/v1/directories', payload);
}