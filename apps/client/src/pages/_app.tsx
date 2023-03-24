import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { Button } from '@ui/atoms';
import { AuthLoader } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';

// Import styles
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

// Extend Day.js
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <Button
        onClick={() =>
          window.location.replace(
            '/auth/login?redirect=' + encodeURIComponent(location.pathname + location.search)
          )
        }
      >
        Login
      </Button>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ToastContainer />
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
            <Component {...pageProps} />
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </>
  );
}
