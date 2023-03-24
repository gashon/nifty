import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

type InternalErrorProps = {
  message: string;
};

const InternalError: FC<InternalErrorProps> = () => {
  // get mesesage from query param (message)
  const router = useRouter();
  const { message } = router.query;

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-6">
      <Image src="/auth-denied.svg" alt="Sad illustration" width={150 * 2} height={130.58 * 2} />
      <h1 className="text-5xl font-extrabold">Something went wrong.</h1>
      <p className="flex items-center gap-3 text-red-500">
        <FiAlertTriangle /> {message}
      </p>
    </main>
  );
};

export default InternalError;
