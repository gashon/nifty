import Axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { toast, ToastOptions } from 'react-toastify';

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
    // token expired
    if (error?.response?.status === 401) {
      location.replace(`/internal-error?message=${encodeURIComponent(
        'Your session has expired. Please login again.'
      )}?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      toast.dismiss();

      // todo create a proper session expired page and redirect to it
      toast.error('Your session has expired. Please login again.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // wait for toast to be dismissed
      setTimeout(() => {
        location.replace('/auth/login?redirect=' + encodeURIComponent(location.pathname + location.search));
      }, 3000);
      return;
    }

    const message = error.response?.data?.message || error.message;
    errorNotification(message)

    return undefined
  }
);
