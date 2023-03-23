import { ParsedUrlQuery } from 'querystring';
import { AxiosReponse } from 'axios';

import { axios } from '@/lib/axios';
import { IUser } from '@api/lib/models/user';

export const getUser = async () => {
  return await axios.get('/api/ajax/auth/user');
};

export function recycleToken(token: string) {
  return fetch(`${process.env.API_BASE_URL}/ajax/auth/recycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ authorization: token }),
  }).then(res => res.json());
}

// export const login = (data: LoginData, params: ParsedUrlQuery) => {
//   return axios.post('/ajax/auth/login/email', data, { params });
// };
