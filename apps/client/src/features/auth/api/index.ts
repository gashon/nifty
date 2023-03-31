import { ParsedUrlQuery } from 'querystring';
import { useQuery } from 'react-query';
import { AxiosReponse } from 'axios';

import { axios } from '@/lib/axios';
import { IUser } from '@api/lib/models/user';

import { LoginFormData } from '../types';

export const getUser = async (headers?: { [key: string]: string }) => {
  return axios.get('/api/ajax/auth/user', {
    headers,
  });
};

export const emailLogin = async (payload: LoginFormData, params: ParsedUrlQuery, enabled?: boolean) => {
  return axios.post('/ajax/auth/login/email', payload, { params });
};

export const signOut = async () => {
  return axios.get('/ajax/auth/logout');
}
