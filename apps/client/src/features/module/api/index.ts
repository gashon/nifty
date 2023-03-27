import { AxiosResponse } from 'axios';
import { axios } from '@/lib/axios';
import { DirectoryCreateRequest, IDirectory } from '@nifty/server-lib/models/directory';


type DirectoryCreateResponse = { data: IDirectory };
export const createModule = async (payload: DirectoryCreateRequest): Promise<AxiosResponse<DirectoryCreateResponse>> => {
  return axios.post<DirectoryCreateResponse>('/api/v1/directories', payload);
}