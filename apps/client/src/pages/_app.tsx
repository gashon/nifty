import React from 'react';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { Button } from '@nifty/ui/atoms';
import { queryClient } from '@/lib/react-query';

// Import styles
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'feeder-react-feedback/dist/feeder-react-feedback.css';
import { UserFeedback } from '@/components/feedback';

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
      <h2 className=" text-lg font-semibold">
        Ooops, something went wrong :({' '}
      </h2>
      <div className="flex flex-row gap-5 mt-5">
        <Button
          onClick={() =>
            window.location.replace(
              '/auth/login?redirect=' +
                encodeURIComponent(location.pathname + location.search)
            )
          }
        >
          Login
        </Button>
        <Button
          onClick={() =>
            // reload the current page
            window.location.replace(location.pathname + location.search)
          }
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <ToastContainer />
              <Component {...pageProps} />
              {process.env.NEXT_PUBLIC_FEEDER_PROJECT_ID && (
                <UserFeedback
                  // @ts-ignore
                  projectId={
                    process.env.NEXT_PUBLIC_FEEDER_PROJECT_ID as string
                  }
                />
              )}
            </ThemeProvider>
            {process.env.NODE_ENV !== 'test' && (
              <ReactQueryDevtools position={'bottom-right'} />
            )}
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </>
  );
}
