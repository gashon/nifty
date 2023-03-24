import { FC, memo } from 'react';
import { useTheme } from 'next-themes';

import { DropdownMenu } from '@ui/atoms';

const AVAILABLE_THEMES = ['dark', 'light', 'pink', 'blue'] as const;
type ThemeType = (typeof AVAILABLE_THEMES)[number];

const ThemeSelection: FC = ({}) => {
  const { theme, setTheme } = useTheme();

  const updateTheme = (t: ThemeType) => {
    setTheme(t);
  };

  return (
    <div className={`bg-primary text-primary z-20`}>
      <DropdownMenu
        buttonAs="button"
        list={AVAILABLE_THEMES.map(t => ({
          icon: <h1>Icon</h1>,
          label: t,
          onClick: () => updateTheme(t),
        }))}
      >
        Change Theme
      </DropdownMenu>
    </div>
  );
};

export default memo(ThemeSelection);
