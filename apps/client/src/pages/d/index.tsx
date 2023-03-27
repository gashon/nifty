import { NextSeo } from 'next-seo';

import { AuthProtection, useAuth } from '@/features/auth';
import ThemeLayout from '@/layouts/theme';
import DashboardLayout from '@/layouts/dashboard';

import { LoadingPage } from '@nifty/ui/pages/loading';
import { TodaysActivity } from '@nifty/ui/pages/todays-activity';

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
          <TodaysActivity
            userName={user?.email}
            userAvatar={user?.avatar}
            greetingProps={{ isLoading }}
            recentModules={{ isLoading }}
            recentNotebooks={{ isLoading }}
          />
        </ThemeLayout>
      </AuthProtection>
    </>
  );
}
