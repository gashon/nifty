import { ParsedUrlQuery } from 'querystring';
import { AxiosReponse } from 'axios';

import { axios } from '@/lib/axios';
import { IUser } from '@api/lib/models/user';

import { LoginFormData } from '../types';

export const getUser = async () => {
  return await axios.get('/api/ajax/auth/user');
};

// export function recycleToken(refreshToken: string) {
//   return fetch(`${process.env.API_BASE_URL}/ajax/auth/recycle`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ refresh_token: refreshToken }),
//   }).then(res => res.json());
// }

export const login = (data: LoginFormData, params: ParsedUrlQuery) => {
  return axios.post('/ajax/auth/login/email', data, { params });
};
