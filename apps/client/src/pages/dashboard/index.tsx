import { NextSeo } from 'next-seo';
import { lazy } from 'react';

import { AuthProtection, AuthProvider } from '@/features/auth';
import { GreetingHeader } from '@/features/dashboard/components';

import ThemeLayout from '@/layouts/theme';
import DashboardLayout from '@/layouts/dashboard';

import { LoadingPage } from '@nifty/ui/pages/loading';

const RecentModules = lazy(
  () => import('@/features/dashboard/components/recent-modules')
);
const RecentNotebooks = lazy(
  () => import('@/features/dashboard/components/recent-notebooks')
);

export default function Dashboard() {
  return (
    <>
      <NextSeo title={'Dashboard'} noindex />
      <AuthProvider>
        <AuthProtection loadingComponent={<LoadingPage />}>
          <ThemeLayout>
            <DashboardLayout>
              <GreetingHeader greeting={`Hello`} quote="" />
              <div className="flex flex-col">
                <section className="order-2 pt-9 lg:order-1">
                  <h3 className="pb-3 text-xs text-zinc-600 dark:text-zinc-400 lg:text-base">
                    Classes
                  </h3>
                  <RecentModules />
                </section>
                <section className="order-1 pt-9 mt-5">
                  <h3 className="pb-3 text-xs text-zinc-600 dark:text-zinc-400 lg:text-base">
                    Recently edited notebooks
                  </h3>
                  <RecentNotebooks />
                </section>
              </div>
            </DashboardLayout>
          </ThemeLayout>
        </AuthProtection>
      </AuthProvider>
    </>
  );
}
