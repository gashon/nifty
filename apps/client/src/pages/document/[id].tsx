import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { lazy } from 'react';

import ThemeLayout from '@/layouts/theme';
import DashboardLayout from '@/layouts/dashboard';
import { AuthProtection, useAuth } from '@/features/auth';
import { NotebookList } from '@/features/module';

import { LoadingPage } from '@nifty/ui/pages/loading';

export default function Module() {
  const router = useRouter();
  const { isOffline } = useAuth();

  const { documentId } = router.query;

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
          <DashboardLayout>
            <main className="flex flex-col order-1 pt-9">
              <h3 className="pb-6 text-3xl text-primary dark:text-zinc-400 ">Notebook Name</h3>
              <NotebookList moduleId={documentId as string} />
            </main>
          </DashboardLayout>
        </ThemeLayout>
      </AuthProtection>
    </>
  );
}
