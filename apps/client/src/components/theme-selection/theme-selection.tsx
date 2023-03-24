import { FC, useEffect, useCallback, memo } from 'react';
import { useTheme } from 'next-themes';

const AVAILABLE_THEMES = ['dark', 'pink'] as const;
type ThemeType = (typeof AVAILABLE_THEMES)[number];

const ThemeSelection: FC = ({}) => {
  const { theme, setTheme } = useTheme();

  const updateTheme = (t: ThemeType) => {
    setTheme(t);
  };

  return (
    <div className={`bg-primary text-primary`}>
      <h1 className="text-3xl font-bold">My App</h1>
      <button onClick={() => updateTheme(theme === 'dark' ? 'pink' : 'dark')}>Switch theme</button>
      <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  );
};

export default memo(ThemeSelection);
