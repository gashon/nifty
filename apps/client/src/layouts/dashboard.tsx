import React from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/features/auth';
import ThemeLayout from '@/layouts/theme';

export default function DashboardLayout({ children }) {
  const { user, isLoading, isOffline, error } = useAuth();

  if (isLoading) return <h1>Loading...</h1>;
  if (!isOffline) {
    // todo handle offline mode here
    // todo e.g. create provider with boolean value for offline mode
  }

  return (
    <ThemeLayout>
      <div className="container mx-auto px-6 py-8 md:px-0">
        <Navbar />
        <div className="flex flex-1 h-full pt-14">{children}</div>
      </div>
    </ThemeLayout>
  );
}
