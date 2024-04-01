import { FC, useState, useEffect } from 'react';
import { FiChevronUp, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import { useMediaQuery } from 'usehooks-ts';

import { DropdownMenu } from '../../atoms/dropdown-menu';
import type { Selectable, User } from '@nifty/common/types';

export type UserCardProps = Selectable<User> & {
  signOut?: () => void;
};

export const UserCard: FC<UserCardProps> = ({
  firstName,
  lastName,
  avatarUrl,
  signOut,
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const name = firstName && lastName ? `${firstName} ${lastName}` : null;

  return (
    <DropdownMenu
      buttonAs="div"
      pos="top"
      itemClassName="text-primary"
      list={[
        // todo implement these apges
        // {
        //   label: 'Profile',
        //   href: '/dashboard/profile',
        //   icon: <FiUser />,
        // },
        // {
        //   label: 'Settings',
        //   href: '/dashboard/settings',
        //   icon: <FiSettings />,
        // },
        {
          label: 'Sign out',
          onClick: () => (signOut ? signOut() : console.log('signing out')),
          icon: <FiLogOut />,
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
            src={avatarUrl || '/user-placeholder.svg'}
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
