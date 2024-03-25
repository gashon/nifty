import { lazy, FC, ReactNode } from 'react';
import { Authorization } from '@nifty/client/lib/authorization';

const ThemeSelection = lazy(
  () => import('@nifty/client/components/theme-selection/theme-selection')
);

type ThemeLayoutProps = {
  children: ReactNode;
};

const ThemeLayout: FC<ThemeLayoutProps> = ({ children }) => {
  return (
    <div className="relative">
      <div className="fixed bottom-5 left-5">
        <ThemeSelection />
      </div>
      {children}
    </div>
  );
};

export default ThemeLayout;
