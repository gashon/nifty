import { FC } from 'react';
import { Button } from '@nifty/ui/atoms';

export const ErrorFallback: FC = () => {
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
