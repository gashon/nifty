import { FC, ComponentProps, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { FiMenu, FiX } from 'react-icons/fi';
import AnimateHeight from 'react-animate-height';

import { useAuth } from '@/features/auth';
import { Brand } from '@nifty/ui/atoms';
import { SidebarLink, UserCard } from '@nifty/ui/molecules';

type SidebarProps = {
  links: ComponentProps<typeof SidebarLink>[];
};

export const Sidebar: FC<SidebarProps> = ({ links }) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // eslint-disable-next-line no-nested-ternary
  const menuHeight = isDesktop ? 'auto' : menuOpen ? 'auto' : 0;
  return (
    <nav className="flex w-full flex-col justify-between p-3 lg:w-72 lg:p-6">
      <div>
        <div className="flex items-center justify-between">
          <a href="/" className="text-primary flex items-center gap-3 px-0 font-extrabold lg:px-3">
            <Brand size={36} />
            <span>Nifty</span>
          </a>
          <div className="flex items-center gap-3">
            {!isDesktop && <UserCard {...user} />}
            <button
              data-testid="menu-button"
              type="button"
              className="inline-block lg:hidden"
              onClick={() => setMenuOpen(prev => !prev)}
            >
              {menuOpen ? (
                <FiX title="Close menu" size={24} />
              ) : (
                <FiMenu title="Open menu" size={24} />
              )}
            </button>
          </div>
        </div>
        <AnimateHeight data-testid={`menu-${menuHeight}`} duration={150} height={menuHeight}>
          <ul className="flex-1 pt-3 lg:pt-6">
            {links.map(link => (
              <li key={link.href}>
                <SidebarLink {...link} />
              </li>
            ))}
          </ul>
        </AnimateHeight>
      </div>
      {isDesktop && <UserCard {...user} />}
    </nav>
  );
};

export default Sidebar;
