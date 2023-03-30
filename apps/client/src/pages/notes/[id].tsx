import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import ThemeLayout from '@/layouts/theme';
import { AuthProtection, useAuth } from '@/features/auth';
import { LoadingPage } from '@nifty/ui/pages/loading';
const DocumentEditor = dynamic(() => import('@/features/note/components/editor'), { ssr: false });
// import Editor from 'rich-markdown-editor';
// import Dante, { darkTheme, defaultTheme, defaultPlugins } from '@nifty/dante3/index';
// const Dante = dynamic(() => import('Dante2'), { ssr: false });

export default function Document() {
  const router = useRouter();
  const { isOffline } = useAuth();
  const { id, name } = router.query;
  const [isMounted, setIsMounted] = useState(false);
  const [code, setCode] = useState('');
  console.log('got NAME', name);

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
        <ThemeLayout>
          <div className="flex items-center justify-center w-screen">
            <div className="flex flex-col order-1 p-16 w-full lg:w-2/3">
              <h1 className="mb-12 text-5xl text-primary dark:text-zinc-400 underline">{name}</h1>
              <main className="h-screen">
                <DocumentEditor />
                {/* <Editor placeholder="test" value={code} onChange={e => setCode(e)} />{' '} */}
                {/* <Dante content={'hello world'} /> */}
              </main>
              done
            </div>
          </div>
        </ThemeLayout>
      </AuthProtection>
    </>
  );
}
