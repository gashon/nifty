import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { lazy } from 'react';

import storage from '@/lib/storage';
import ThemeLayout from '@/layouts/theme';
import DashboardLayout from '@/layouts/dashboard';
import { AuthProtection, useAuth, getUser, AuthProvider } from '@/features/auth';
import { NoteCreationButton, NotebookList, getNotes } from '@/features/note';

import { LoadingPage } from '@nifty/ui/pages/loading';

function Module({ notes, user, id }) {
  const router = useRouter();

  const { name: moduleName } = router.query;

  // if (typeof window !== 'undefined') return null;

  return (
    <>
      <NextSeo title={`Module: ${moduleName}`} noindex />
      <AuthProvider preloadedUser={user}>
        <AuthProtection loadingComponent={<LoadingPage />}>
          <ThemeLayout>
            <DashboardLayout>
              <main className="flex flex-col order-1 pt-9 w-auto relative">
                <h3 className="pb-6 text-3xl text-primary dark:text-zinc-400 ">
                  Module: {moduleName}
                </h3>
                <NoteCreationButton moduleId={id as string} />
                <NotebookList notes={notes} moduleId={id as string} />
              </main>
            </DashboardLayout>
          </ThemeLayout>
        </AuthProtection>
      </AuthProvider>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  const [{ data: notes }, { data: user }] = await Promise.all([
    getNotes(id, { limit: 0 }, context.req.headers),
    getUser(context.req.headers),
  ]);

  return {
    props: {
      id,
      user,
      notes: notes ? { pages: [notes] } : { pages: [] },
    },
  };
}

export default Module;
