import clsx from 'clsx';
import NextLink from 'next/link';
import React from 'react';

export interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const Link = ({ href, className, children }: LinkProps) => (
  <NextLink href={href} legacyBehavior>
    <a className={clsx('text-blue-500 hover:underline', className)}>{children}</a>
  </NextLink>
);
