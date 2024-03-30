import { ParsedUrlQuery } from 'querystring';
import { AxiosResponse } from 'axios';
import { axios } from '@nifty/client/lib/axios';

import { LoginFormData } from '../types';
import type { GetUserResponse } from '@nifty/api/domains/user/dto';

export const getUser = async (headers?: {
  [key: string]: string;
}): Promise<AxiosResponse<GetUserResponse>> => {
  const data = await axios.get('/ajax/auth/user', {
    headers,
  });

  return data;
};

export const emailLogin = async (
  payload: LoginFormData,
  params: ParsedUrlQuery,
  enabled?: boolean
) => {
  return axios.post('/ajax/auth/login/email', payload, { params });
};

export const signOut = async () => {
  return axios.get('/ajax/auth/logout');
};
