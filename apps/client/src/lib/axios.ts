import Axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { toast, ToastOptions } from 'react-toastify';

import { errorNotification } from "@/lib/notification";
import { API_URL } from '@/config';

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // token expired
    if (error?.response?.status === 401) {
      location.replace(`/error/internal?message=${encodeURIComponent(
        'Your session has expired. Please login again.'
      )}&redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return
    }

    const message = error.response?.data?.message || error.message;
    errorNotification(message)

    return undefined
  }
);
