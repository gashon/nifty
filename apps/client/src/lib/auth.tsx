import { configureAuth } from 'react-query-auth';
import { axios } from './axios';

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } = configureAuth<
  any,
  any,
  any,
  any
>({
  // @ts-ignore
  userFn: axios.get('/auth/user'),
  loginFn: () => axios.get('/auth/login'),
  registerFn: credentials => axios.post('/auth/register', credentials),
  logoutFn: credentials => axios.post('/auth/logout', credentials),
});
