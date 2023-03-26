import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Button } from '@nifty/ui/atoms';

type InternalErrorProps = {
  message: string;
};

const InternalError: FC<InternalErrorProps> = () => {
  const router = useRouter();
  const { message, redirect } = router.query;

  return (
    <main className="bg-primary flex h-screen flex-col items-center justify-center gap-6">
      <Image src="/auth-denied.svg" alt="Sad illustration" width={150 * 2} height={130.58 * 2} />
      <h1 className="text-primary text-5xl font-extrabold">Something went wrong.</h1>
      <p className="flex items-center gap-3 text-red-500">
        <FiAlertTriangle /> {message}
      </p>
      <div className="flex flex-row gap-3">
        {redirect && typeof redirect === 'string' && (
          <Button
            variant="primary"
            onClick={() => {
              // reload the page (redirect to the "redirect" page)
              location.replace(redirect);
            }}
          >
            Try again
          </Button>
        )}
        <Button
          onClick={() => {
            location.replace(
              '/auth/login?redirect=' +
                (redirect || encodeURIComponent(location.pathname + location.search))
            );
          }}
          variant="secondary"
        >
          Log in
        </Button>
      </div>
    </main>
  );
};

export default InternalError;
