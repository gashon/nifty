import { configureAuth } from 'react-query-auth';
import { axios } from './axios';
import { Spinner } from '@/components/elements';
// import {
//   loginWithEmailAndPassword,
//   getUser,
//   registerWithEmailAndPassword,
//   UserResponse,
//   LoginCredentialsDTO,
//   RegisterCredentialsDTO,
//   AuthUser,
// } from '@/features/auth';
// // import storage from '../utils/storage';

// async function handleUserResponse(data: UserResponse) {
//   const {
//     user,
//     token: { access_token, refresh_token },
//   } = data;

//   storage.token.access.set(access_token);
//   storage.token.refresh.set(refresh_token);

//   return user;
// }

// async function loadUser() {
//   if (storage.token.access.get()) {
//     const data = await getUser();
//     return data;
//   }
//   return null;
// }

// async function loginFn(data: LoginCredentialsDTO) {
//   const response = await loginWithEmailAndPassword(data);
//   const user = await handleUserResponse(response);
//   return user;
// }

// async function registerFn(data: RegisterCredentialsDTO) {
//   const response = await registerWithEmailAndPassword(data);
//   const user = await handleUserResponse(response);
//   return user;
// }

// async function logoutFn() {
//   storage.token.access.clear();
//   window.location.assign(window.location.origin as unknown as string);
// }

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
