import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import ThemeLayout from '@/layouts/theme';
import { AuthProtection, useAuth } from '@/features/auth';
import { LoadingPage } from '@nifty/ui/pages/loading';
const DocumentEditor = dynamic(() => import('@/features/note/components/editor'), { ssr: false });

export default function Document() {
  const router = useRouter();
  const { isOffline } = useAuth();
  const { id } = router.query;
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
      <NextSeo title={'Module'} noindex />
      <AuthProtection loadingComponent={<LoadingPage />}>
        <ThemeLayout>
          <main className="flex flex-col order-1 pt-9">
            <h3 className="pb-6 text-3xl text-primary dark:text-zinc-400 ">Editor</h3>
            conte
            <div className="h-screen">
              <DocumentEditor documentId={id as string} />
            </div>
            done
          </main>
        </ThemeLayout>
      </AuthProtection>
    </>
  );
}
