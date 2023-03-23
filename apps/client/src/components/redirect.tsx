import { useRouter } from 'next/router';
import React from 'react';
import { LinkProps } from 'ui/components/link';

interface RedirectProps extends React.HTMLAttributes<HTMLDivElement> {
  to: LinkProps['href'];
}

export default function Redirect({ to }: RedirectProps) {
  const router = useRouter();

  React.useEffect(() => {
    router.push(to);
  });

  return <div />;
}
