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
            greetingProps={{ isLoading, greeting: 'Hello Gashon', quote: "You're doing great!" }}
            recentModules={{
              isLoading,
              data: [
                {
                  href: '/modules/1',
                  icon: '🧠',
                  name: 'Algorithms and Complexity',
                  code: 'CS2860',
                  color: 'red',
                  credits: 15,
                },
                {
                  href: '/modules/2',
                  icon: '📽',
                  name: 'IT Project Management',
                  code: 'CS3003',
                  color: 'green',
                  credits: 15,
                },
                {
                  href: '/modules/3',
                  icon: '💅',
                  name: 'User centered design',
                  code: 'PC3001',
                  color: 'indigo',
                  credits: 15,
                },
                {
                  href: '/modules/4',
                  icon: '📌',
                  name: 'Final Year Project',
                  code: 'CS3810',
                  color: 'amber',
                  credits: 15,
                },
                {
                  href: '/modules/5',
                  icon: '🔐',
                  name: 'Malicious Software',
                  code: 'IY3840',
                  color: 'blue',
                  credits: 15,
                },
              ],
            }}
            recentNotebooks={{ isLoading }}
          />
        </ThemeLayout>
      </AuthProtection>
    </>
  );
}
