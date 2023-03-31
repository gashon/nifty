import { FC, useState, useEffect } from 'react';
import { FiChevronUp, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import { useMediaQuery } from 'usehooks-ts';
import { DropdownMenu } from '../../atoms/dropdown-menu';

type UserCardProps = {
  name?: string;
  avatar?: string;
  signOut?: () => void;
};

export const UserCard: FC<UserCardProps> = ({ name, avatar, signOut }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return (
    <DropdownMenu
      buttonAs="div"
      pos="top"
      list={[
        {
          label: 'Profile',
          href: '/dashboard/profile',
          icon: <FiUser />,
        },
        {
          label: 'Sign out',
          onClick: () => (signOut ? signOut() : console.log('signing out')),
          icon: <FiLogOut />,
        },
        {
          label: 'Settings',
          href: '/dashboard/settings',
          icon: <FiSettings />,
        },
      ]}
    >
      <button
        type="button"
        className={twMerge(
          'flex w-auto items-center justify-center gap-3 p-3 transition-colors focus-within:outline-none focus-visible:border-none lg:w-full lg:justify-start',
          name && 'lg:justify-center'
        )}
      >
        <div className="flex items-center gap-3 text-left">
          <img
            src={avatar || '/user-placeholder.svg'}
            alt={name}
            className="h-8 w-8 rounded-full lg:h-10 lg:w-10"
          />
          {name && (
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-primary">{name}</p>
            </div>
          )}
        </div>
        {isDesktop && <FiChevronUp size={24} className="text-zinc-500" />}
      </button>
    </DropdownMenu>
  );
};

export default UserCard;
