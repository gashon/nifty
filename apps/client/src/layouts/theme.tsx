import { lazy, FC, ReactNode } from 'react';
const ThemeSelection = lazy(() => import('@/components/theme-selection/theme-selection'));

type ThemeLayoutProps = {
  children: ReactNode;
};

const ThemeLayout: FC<ThemeLayoutProps> = ({ children }) => {
  return (
    <div className="relative">
      <div className="absolute top-5 left-5">
        <ThemeSelection />
      </div>
      {children}
    </div>
  );
};

export default ThemeLayout;
