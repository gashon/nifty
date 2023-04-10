import { FC, ReactElement, PropsWithChildren } from 'react';
import { FiBook, FiCheck, FiGrid, FiHome } from 'react-icons/fi';
import { Sidebar } from '@/components/sidebar';

type DashboardLayoutProps = {
  children: ReactElement | ReactElement[];
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <main className="bg-primary flex h-screen flex-col gap-3 p-3 lg:flex-row lg:gap-6 lg:p-6">
      <Sidebar
        links={[
          {
            label: 'Home',
            href: '/dashboard',
            icon: <FiHome />,
          },
          {
            label: 'Modules',
            href: '/modules',
            icon: <FiGrid />,
          },
          {
            label: 'Quizzes',
            href: '/quizzes',
            icon: <FiBook />,
          },
        ]}
      />
      <div className=" flex-1 overflow-y-scroll  p-8 scrollbar-hide dark:ring-zinc-800">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
