import { lazy, FC, ReactElement, PropsWithChildren } from 'react';
import { FiBook, FiCheck, FiGrid, FiHome } from 'react-icons/fi';
// import { Sidebar } from '@/features/dashboard/components';
const Sidebar = lazy(() => import('@/components/sidebar'));
import { useAuth } from '@/features/auth';

type DashboardLayoutProps = {
  children: ReactElement[];
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <main className="bg-primary flex h-screen flex-col gap-3 p-3 lg:flex-row lg:gap-6 lg:p-6">
      <Sidebar
        links={[
          {
            label: 'Home',
            href: '/',
            icon: <FiHome />,
          },
          {
            label: 'Modules',
            href: '/modules',
            icon: <FiGrid />,
          },
          {
            label: 'Task list',
            href: '/tasks',
            icon: <FiCheck />,
          },
          {
            label: 'Notebooks',
            href: '/notebooks',
            icon: <FiBook />,
          },
        ]}
      />
      <div className="border-2 border-accent flex-1 overflow-y-scroll rounded-2xl p-8 scrollbar-hide dark:ring-zinc-800">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
