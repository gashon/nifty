import { useRouter } from 'next/router';
import Script from 'next/script';
import { NextSeo } from 'next-seo';
import React from 'react';
import Redirect from '@/components/redirect';
import { Navbar } from '@/components/navbar';
import useUser from '@/hooks/use-user';

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const router = useRouter();
  const { data, isLoading, error } = useUser();

  if (isLoading) return <h1>Loading...</h1>;
  if (!data) {
    // todo handle offline mode here
    // todo e.g. create provider with boolean value for offline mode
    return null;
  }

  return (
    <>
      <Script
        id="authScript"
        dangerouslySetInnerHTML={{
          // todo handle offline mode here
          __html: `
            // if (!document.cookie || document.cookie.indexOf('authorization=') === -1) {
            //   location.replace('/auth/login?redirect=' + encodeURIComponent(location.pathname + location.search));
            // }
         `,
        }}
      />
      <div className="container mx-auto px-6 py-8 md:px-0">
        <Navbar />
        <div className="flex flex-1 h-full pt-14">{children}</div>
      </div>
      <NextSeo title={title} noindex />
    </>
  );
}
