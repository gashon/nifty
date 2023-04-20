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
import { ErrorFallback } from '@/components/error-fallback';
import { queryClient } from '@/lib/react-query';
const UserFeedback = dynamic(() => import('@/components/feedback'), {
  ssr: false,
});

// Import styles
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'feeder-react-feedback/dist/feeder-react-feedback.css';

// Extend Day.js
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

const logError = (error: Error, info: { componentStack: string }) => {
  // todo send error to sentry
  console.error('Error', error);
  console.error('Info', info);
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <ToastContainer />
              <Component {...pageProps} />
              {/* todo hide feedback in dev mode */}
              <UserFeedback
                projectId={process.env.NEXT_PUBLIC_FEEDER_PROJECT_ID}
              />
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
