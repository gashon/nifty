import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, FC } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { FiGithub, FiMenu, FiTwitter, FiX } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import { Brand } from '@nifty/ui/atoms/brand';
import { NavLink } from '@nifty/ui/atoms/nav-link';

export const Navbar: FC = () => {
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbarOpen = () => setNavbarOpen(prev => !prev);

  return (
    <nav className="relative flex justify-between">
      <Link
        href={!router.pathname.includes('/dashboard') ? '/' : '/dashboard'}
        className="flex items-center gap-3 font-extrabold"
      >
        <div>
          <Brand size={35} />
          <span>Niftie</span>
        </div>
      </Link>
      <div className="flex items-center gap-6">
        <ul
          data-testid="pages-links"
          className={twMerge(
            'hidden gap-6 md:flex',
            navbarOpen && 'absolute left-0 top-12 flex w-full flex-col bg-zinc-900 py-3'
          )}
        >
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="https://github.com/gashon/nifty" external>
              Contributing
            </NavLink>
          </li>
          <li>
            <NavLink href="https://github.com/gashon/nifty" external>
              Design System
            </NavLink>
          </li>
        </ul>
        <div className="hidden h-8 w-[1px] bg-zinc-200 dark:bg-zinc-700 md:inline-block" />
        <ul className="flex items-center gap-6">
          <li>
            <NavLink href="https://github.com/gashon/nifty" external>
              <FiGithub title="Github" size={22} />
            </NavLink>
          </li>
          <li>
            <NavLink href="https://github.com/gashon/nifty" external>
              <FiTwitter title="Twitter" size={22} />
            </NavLink>
          </li>
          <li>
            <NavLink href="https://github.com/gashon/nifty" external>
              <FaDiscord title="Discord" size={22} />
            </NavLink>
          </li>
          <li>
            <button type="button" onClick={toggleNavbarOpen} className="inline-block md:hidden">
              {navbarOpen ? (
                <FiX title="close-menu" size={22} />
              ) : (
                <FiMenu title="open-menu" size={22} />
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
