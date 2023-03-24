import { FC, useEffect } from 'react';
import { useTheme } from 'next-themes';

const themes = ['dark', 'pink'];

export const ThemeSelection: FC = ({}) => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log('setting', theme);
    // localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load the previously selected theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className={`bg-primary text-primary`}>
      <h1 className="text-3xl font-bold">My App</h1>
      <button onClick={() => setTheme(theme === 'dark' ? 'pink' : 'dark')}>Switch theme</button>
      <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  );
};
