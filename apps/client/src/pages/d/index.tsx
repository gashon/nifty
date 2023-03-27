import { NextSeo } from 'next-seo';
import { lazy } from 'react';

import { AuthProtection, useAuth } from '@/features/auth';
import { GreetingHeader } from '@/features/dashboard/components';

import ThemeLayout from '@/layouts/theme';
import DashboardLayout from '@/layouts/dashboard';

import { LoadingPage } from '@nifty/ui/pages/loading';

const RecentModules = lazy(() => import('@/features/dashboard/components/recent-modules'));
const RecentNotebooks = lazy(() => import('@/features/dashboard/components/recent-notebooks'));

export default function Dashboard() {
  const { user, isOffline, isLoading } = useAuth();

  if (isOffline) {
    // todo handle offline mode here
    // todo e.g. create provider with boolean value for offline mode
    return <h1>You're in offline mode</h1>;
  }

  return (
    <>
      <NextSeo title={'Dashboard'} noindex />
      <AuthProtection loadingComponent={<LoadingPage />}>
        <ThemeLayout>
          <DashboardLayout>
            <GreetingHeader greeting={`Hello ${user?.email}`} quote="You're doing great" />
            <div className="flex flex-col">
              <section className="order-2 pt-9 lg:order-1">
                <h3 className="text-primary pb-3 text-xs dark:text-zinc-400 lg:text-base">
                  Modules
                </h3>
                <RecentModules />
              </section>
              <section className="order-1 pt-9">
                <h3 className="pb-3 text-xs text-zinc-600 dark:text-zinc-400 lg:text-base">
                  Recently edited notebooks
                </h3>
                <RecentNotebooks />
              </section>
            </div>
          </DashboardLayout>
        </ThemeLayout>
      </AuthProtection>
    </>
  );
}
