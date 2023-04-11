import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import ThemeLayout from '@/layouts/theme';
import DashboardLayout from '@/layouts/dashboard';
import { AuthProtection, AuthProvider, getUser } from '@/features/auth';
import { QuizList, QuizCreationButton } from '@/features/quiz';

import { LoadingPage } from '@nifty/ui/pages/loading';

function Module({ user }) {
  const router = useRouter();

  return (
    <>
      <NextSeo title={'Module'} noindex />
      <AuthProvider preloadedUser={user}>
        <AuthProtection loadingComponent={<LoadingPage />}>
          <ThemeLayout>
            <DashboardLayout>
              <main className="flex flex-col order-1 pt-9">
                <h3 className="pb-6 text-3xl text-primary dark:text-zinc-400 ">Notebook Name</h3>
                <div className="flex flex-col">
                  <div className="mb-3">
                    <ModuleCreationButton />
                  </div>
                  <ModuleList />
                </div>
              </main>
            </DashboardLayout>
          </ThemeLayout>
        </AuthProtection>
      </AuthProvider>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { data: user } = await getUser(req.headers);
  return {
    props: { user },
  };
}

export default Module;
