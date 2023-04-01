import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

const styles = cva(
  [
    'text-primary',
    'opacity-75',
    'dark:text-zinc-400',
    'transition-colors',
    'hover:opacity-100',
  ],
  {
    variants: {
      active: {
        true: [
          'text-primary-500',
          'dark:text-primary-500',
          'hover:text-primary-700',
          'font-bold',
          'dark:hover:text-primary-700',
        ],
      },
    },
  }
);

type NavLinkProps = {
  readonly href: string;
  readonly children: ReactNode;
  readonly external?: boolean;
};

export const NavLink: FC<NavLinkProps> = ({ href, children, external }) => {
  const router = useRouter();

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={styles({ active: false })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href}>
      <div className={styles({ active: router && router.pathname === href })}>
        {children}
      </div>
    </Link>
  );
};
