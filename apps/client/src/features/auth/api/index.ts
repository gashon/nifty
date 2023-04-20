import { ParsedUrlQuery } from 'querystring';
import { AxiosResponse } from 'axios';
import { axios } from '@/lib/axios';
import { IUser } from '@nifty/server-lib/models/user';

import { LoginFormData } from '../types';

export const getUser = async (headers?: { [key: string]: string }): Promise<AxiosResponse<IUser>> => {
  return axios.get('/ajax/auth/user', {
    headers,
  });
};

export const emailLogin = async (payload: LoginFormData, params: ParsedUrlQuery, enabled?: boolean) => {
  return axios.post('/ajax/auth/login/email', payload, { params });
};

export const signOut = async () => {
  return axios.get('/ajax/auth/logout');
}
