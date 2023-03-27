import { lazy, FC, ReactNode } from 'react';
import { Authorization } from '@/lib/authorization';

const ThemeSelection = lazy(() => import('@/components/theme-selection/theme-selection'));

type ThemeLayoutProps = {
  children: ReactNode;
};

const ThemeLayout: FC<ThemeLayoutProps> = ({ children }) => {
  return (
    <div className="relative">
      <Authorization checkPolicy="theme:mutate">
        <div className="fixed bottom-5 left-5">
          <ThemeSelection />
        </div>
      </Authorization>
      {children}
    </div>
  );
};

export default ThemeLayout;
