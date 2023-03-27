import { NextSeo } from 'next-seo';

import { AuthProtection } from '@/features/auth';
import DashboardLayout from '@/layouts/dashboard';

import { LoadingPage } from '@nifty/ui/pages/loading';

export default function Dashboard() {
  return (
    <>
      <NextSeo title={'Dashboard'} noindex />
      <AuthProtection loadingComponent={<LoadingPage />}>
        <DashboardLayout>
          <h1>content</h1>
        </DashboardLayout>
      </AuthProtection>
    </>
  );
}
