import { FC, memo } from 'react';
import { useTheme } from 'next-themes';

import { DropdownMenu } from '@ui/atoms';

const AVAILABLE_THEMES = ['dark', 'light', 'pink', 'teal'] as const;
type ThemeType = (typeof AVAILABLE_THEMES)[number];

// https://www.blobmaker.app/
const IconSwitcher = ({ theme }: { theme: ThemeType }) => {
  switch (theme) {
    case 'dark':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#1C1C1C"
            d="M35.7,-61.5C49,-54.1,64.6,-50.2,69.5,-40.5C74.4,-30.8,68.7,-15.4,66.6,-1.2C64.5,13,65.9,25.9,62.2,37.6C58.4,49.2,49.4,59.6,38.1,67.8C26.9,76,13.5,82.1,-0.6,83.2C-14.7,84.2,-29.4,80.2,-38.9,71.1C-48.5,61.9,-52.9,47.5,-58,34.8C-63,22.1,-68.6,11,-69.4,-0.4C-70.2,-11.9,-66.1,-23.9,-61.3,-37C-56.5,-50.1,-50.9,-64.3,-40.6,-73.5C-30.2,-82.7,-15.1,-86.9,-2,-83.5C11.2,-80.1,22.3,-69,35.7,-61.5Z"
            transform="translate(100 100)"
          />
        </svg>
      );
    case 'light':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#E8E8E8"
            d="M38.6,-70.9C49.3,-60.8,56.6,-48.8,65.5,-36.7C74.4,-24.6,84.9,-12.3,87.4,1.4C89.9,15.2,84.4,30.4,75.3,42.1C66.2,53.8,53.4,62.1,40.2,69.9C27.1,77.8,13.5,85.2,-0.8,86.5C-15.1,87.9,-30.1,83,-40.4,73.5C-50.7,64,-56.2,49.8,-61.8,36.8C-67.5,23.7,-73.4,11.9,-75.7,-1.3C-78,-14.5,-76.8,-29.1,-68.9,-38.2C-60.9,-47.3,-46.3,-51.1,-33.7,-60.1C-21.1,-69.1,-10.5,-83.3,1.7,-86.3C14,-89.3,28,-81,38.6,-70.9Z"
            transform="translate(100 100)"
          />
        </svg>
      );
    case 'pink':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#FF0066"
            d="M33.8,-61.9C43.4,-53.1,50.5,-43.2,55.1,-32.7C59.6,-22.2,61.6,-11.1,65.3,2.1C69,15.3,74.4,30.7,70.9,43.1C67.5,55.5,55.2,65,42,70.9C28.7,76.7,14.3,78.9,1.9,75.6C-10.5,72.2,-20.9,63.3,-34.5,57.6C-48.1,51.9,-64.7,49.5,-73.9,40.4C-83.1,31.3,-84.8,15.7,-80.7,2.4C-76.5,-10.9,-66.4,-21.7,-57.6,-31.5C-48.9,-41.2,-41.3,-49.8,-31.9,-58.8C-22.5,-67.7,-11.3,-76.9,0.4,-77.6C12.1,-78.4,24.2,-70.7,33.8,-61.9Z"
            transform="translate(100 100)"
          />
        </svg>
      );
    case 'teal':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#2DD4BF"
            d="M40.8,-75.8C50.1,-65.3,53,-48.8,61.7,-35.2C70.4,-21.5,85,-10.8,87.3,1.3C89.6,13.4,79.7,26.9,69.9,38.6C60.1,50.3,50.3,60.3,38.7,69.1C27.1,78,13.5,85.6,0.5,84.8C-12.6,84,-25.2,74.8,-35.5,65.2C-45.8,55.6,-53.8,45.6,-59.2,34.7C-64.6,23.8,-67.4,11.9,-68.6,-0.7C-69.8,-13.2,-69.3,-26.5,-64.3,-38.1C-59.3,-49.8,-49.8,-59.8,-38.4,-69.1C-26.9,-78.3,-13.4,-86.7,1.2,-88.7C15.8,-90.7,31.5,-86.3,40.8,-75.8Z"
            transform="translate(100 100)"
          />
        </svg>
      );
  }
};

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
          icon: (
            <div
              className="w-10 h-full border border-black rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)' }}
            >
              <IconSwitcher theme={t} />
            </div>
          ),
          label: t.charAt(0).toUpperCase() + t.slice(1),
          onClick: () => updateTheme(t),
        }))}
      >
        Change Theme
      </DropdownMenu>
    </div>
  );
};

export default memo(ThemeSelection);
