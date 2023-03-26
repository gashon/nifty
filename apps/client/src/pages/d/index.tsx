import { NextSeo } from 'next-seo';

import { AuthProtection } from '@/features/auth';
import DashboardLayout from '@/layouts/dashboard';

export default function Dashboard() {
  return (
    <>
      <NextSeo title={'Dashboard'} noindex />
      <AuthProtection>
        <DashboardLayout>
          <h1>content</h1>
        </DashboardLayout>
      </AuthProtection>
    </>
  );
}
