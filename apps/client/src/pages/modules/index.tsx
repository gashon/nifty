import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import ThemeLayout from '@nifty/client/layouts/theme';
import DashboardLayout from '@nifty/client/layouts/dashboard';
import { AuthProtection, AuthProvider, getUser } from '@nifty/client/features/auth';
import { ModuleList, ModuleCreationButton } from '@nifty/client/features/module';

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
                <h3 className="pb-6 text-3xl text-primary dark:text-zinc-400 ">
                  Your Classes
                </h3>
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

  if (!user) {
    return {
      redirect: {
        destination: `/error/external?message=${encodeURIComponent(
          'You are not logged in!'
        )}&${new URLSearchParams({
          redirect: `/modules`,
        })}`,
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}

export default Module;
