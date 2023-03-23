import Axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { errorNotification } from "@/util/notification";
import { API_URL } from '@/config';

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // access token expired
    // const originalRequest = error.config;
    // if (error?.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const authCookie = document.cookie
    //     .split('; ')
    //     .find(row => row.startsWith('authorization='))
    //     ?.split('=')[1];
    //   return axios
    //     .post('/ajax/auth/recycle', {
    //       authorization: authCookie,
    //     })
    //     .catch(err => {
    //       location.replace('/auth/login?redirect=' + encodeURIComponent(location.pathname + location.search));
    //     });
    // } else {
    //   location.replace('/auth/login?redirect=' + encodeURIComponent(location.pathname + location.search));
    // }

    // todo display error notification
    const message = error.response?.data?.message || error.message;
    errorNotification(message)

    return undefined
  }
);
