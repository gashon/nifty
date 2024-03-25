import { ParsedUrlQuery } from 'querystring';
import { AxiosResponse } from 'axios';
import { axios } from '@/lib/axios';
import {User} from "@nifty/common/types"

import { LoginFormData } from '../types';

export const getUser = async (headers?: { [key: string]: string }): Promise<AxiosResponse<User>> => {
  const data = await axios.get('/ajax/auth/user', {
    headers,
  });

  return data;
};

export const emailLogin = async (payload: LoginFormData, params: ParsedUrlQuery, enabled?: boolean) => {
  return axios.post('/ajax/auth/login/email', payload, { params });
};

export const signOut = async () => {
  return axios.get('/ajax/auth/logout');
}
