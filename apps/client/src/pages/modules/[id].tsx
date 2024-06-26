import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import ThemeLayout from '@nifty/client/layouts/theme';
import DashboardLayout from '@nifty/client/layouts/dashboard';
import {
  AuthProtection,
  getUser,
  AuthProvider,
} from '@nifty/client/features/auth';
import {
  NoteCreationButton,
  NotebookList,
  NotebookListSSR,
  getNotes,
  getNotesInDirectory,
} from '@nifty/client/features/note';

import { LoadingPage } from '@nifty/ui/pages/loading';

function Module({ notes, user, id }) {
  const router = useRouter();

  const { name: moduleName } = router.query;

  return (
    <>
      <NextSeo title={`Module: ${moduleName}`} noindex />
      <AuthProvider preloadedUser={user}>
        <AuthProtection loadingComponent={<LoadingPage />}>
          <ThemeLayout>
            <DashboardLayout>
              <main className="flex flex-col order-1 pt-9 w-auto relative">
                <h3 className="pb-6 text-3xl text-primary dark:text-zinc-400 ">
                  {moduleName}
                </h3>
                <NoteCreationButton moduleId={Number(id as string)} />
                <NotebookList notes={notes} moduleId={Number(id as string)} />
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

  const [notesSettle, userSettle] = await Promise.allSettled([
    getNotesInDirectory(id, { limit: '5' }, context.req.headers),
    getUser(context.req.headers),
  ]);

  const notes =
    notesSettle.status === 'fulfilled' ? notesSettle.value?.data : null;
  const user =
    userSettle.status === 'fulfilled' ? userSettle.value?.data : null;

  if (!user) {
    return {
      redirect: {
        // destination: `/error/external?message=${encodeURIComponent("You are not logged in!")}&redirect=%2Fnotes%2F${context.params.id}`,
        destination: `/error/external?message=${encodeURIComponent(
          'You are not logged in!'
        )}&${new URLSearchParams({
          redirect: `/modules/${context.params.id}`,
        })}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
      user,
      notes: notes || { pages: [] },
    },
  };
}

export default Module;
