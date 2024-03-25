import { NextSeo } from 'next-seo';

import { AuthProtection, AuthProvider, getUser } from '@nifty/client/features/auth';
import { GreetingHeader } from '@nifty/client/features/dashboard/components';

import ThemeLayout from '@nifty/client/layouts/theme';
import DashboardLayout from '@nifty/client/layouts/dashboard';
import { IUser } from '@nifty/server-lib/models/user';
import RecentModules from '@nifty/client/features/dashboard/components/recent-modules';
import RecentNotebooks from '@nifty/client/features/dashboard/components/recent-notebooks';

export default function Dashboard({ user }: { user: IUser }) {
  return (
    <>
      <NextSeo title={'Dashboard'} noindex />
      <AuthProvider>
        <AuthProtection loadingComponent={<></>}>
          <ThemeLayout>
            <DashboardLayout>
              <GreetingHeader greeting={`Hello`} quote="" />
              <div className="flex flex-col">
                <section className="order-2 pt-9 lg:order-1">
                  <RecentModules user={user} />
                </section>
                <section className="order-1 pt-9 mt-5">
                  <RecentNotebooks user={user} />
                </section>
              </div>
            </DashboardLayout>
          </ThemeLayout>
        </AuthProtection>
      </AuthProvider>
    </>
  );
}

export async function getServerSideProps(context) {
  const { data: user } = await getUser(context.req.headers);

  if (!user) {
    return {
      redirect: {
        destination: `/error/external?message=${encodeURIComponent(
          'You are not logged in!'
        )}&${new URLSearchParams({
          redirect: `/dashboard`,
        })}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
