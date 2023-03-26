import Axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { toast, ToastOptions } from 'react-toastify';

import { errorNotification, successNotification } from "@/lib/notification";
import { API_URL } from '@/config';

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.response.use(
  response => {
    return response
  }
  ,
  error => {
    const data = error?.response?.data;
    const message = data?.message || data?.error?.message || error.message;

    // token expired
    if (error?.response?.status === 401) {
      location.replace(`/error/internal?message=${encodeURIComponent(
        message || 'Your session has expired. Please login again.'
      )}&redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return
    }

    if (message) {
      const isError = error.response?.status >= 400;
      if (isError) errorNotification(error.response?.status < 500 ? message : "We are experiencing an unexpected rise in traffic. Please try again later.")
      else successNotification(message)
    }

    return error
  }
);
