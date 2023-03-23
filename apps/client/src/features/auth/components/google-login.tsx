import { useRouter } from 'next/router';
import React from 'react';
import { Button } from '@/components/elements';

export default function GoogleLogin() {
  const router = useRouter();
  const redirect = (router.query.redirect as string) || '/d';

  return (
    <Button
      as="a"
      href={`/ajax/auth/login/google?${new URLSearchParams({
        ...router.query,
        redirect,
      }).toString()}`}
      size="xl"
      className="w-full"
      variant="light"
    >
      Continue with Google
    </Button>
  );
}
