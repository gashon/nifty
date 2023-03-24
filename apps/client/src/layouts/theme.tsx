import { lazy } from 'react';
const ThemeSelection = lazy(() => import('@/components/theme-selection/theme-selection'));

export default function ThemeLayout({ children }) {
  return (
    <div className="relative">
      <div className="absolute top-5 left-5">
        <ThemeSelection />
      </div>
      {children}
    </div>
  );
}
