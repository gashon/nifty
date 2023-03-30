import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';

import { AuthProtection, useAuth } from '@/features/auth';
import { LoadingPage } from '@nifty/ui/pages/loading';
import { DocumentSection } from '@/features/note';

export default function Document() {
  const router = useRouter();
  const { isOffline } = useAuth();
  const { name } = router.query;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof window === 'undefined') return null;

  if (isOffline) {
    // todo handle offline mode here
    // todo e.g. create provider with boolean value for offline mode
    return <h1>You're in offline mode</h1>;
  }

  return (
    <>
      <NextSeo title={name as string} noindex />
      <AuthProtection loadingComponent={<LoadingPage />}>
        <header className="fixed w-full p-5">
          <button className="cursor-pointer" onClick={() => router.back()}>
            <BsArrowBarLeft size={25} />
          </button>
        </header>
        <div className="flex items-center justify-center w-screen">
          <div className="flex flex-col order-1 p-16 w-full lg:w-2/3">
            <h1 className="underline mb-12 text-5xl text-primary dark:text-zinc-400 ">{name}</h1>
            <main className="h-screen">
              <DocumentSection />
            </main>
          </div>
        </div>
      </AuthProtection>
    </>
  );
}
