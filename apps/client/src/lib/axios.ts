import Axios from 'axios';

import { errorNotification, successNotification } from "@nifty/client/lib/notification";
import { API_URL } from '@nifty/client/config';

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
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      location.replace(`/error/external?message=${encodeURIComponent(
        message || 'Your session has expired. Please login again.'
      )}&redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return
    }

    if (typeof window !== "undefined" && error?.response?.status === 403) {
      location.replace(`/error/external?message=${encodeURIComponent(
        message || 'You are not authorized to access this page.'
      )}&redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return
    }

    if (message) {
      const isError = error.response?.status >= 400;
      if (isError) errorNotification(error.response?.status < 500 && error.response?.status !== 429 ? message : "We are experiencing an unexpected rise in traffic. Please try again later.")
      else successNotification(message)
    }

    return error
  }
);
