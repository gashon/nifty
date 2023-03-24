import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '@ui/atoms/button';

export default function GoogleLogin() {
  const router = useRouter();
  const redirect = (router.query.redirect as string) || '/d';

  return (
    <Button
      onClick={() => {
        window.location.href = `/ajax/auth/login/google?${new URLSearchParams({
          ...router.query,
          redirect,
        }).toString()}`;
      }}
      icon={<Image src="/Google__G__Logo.svg" alt="Google logo" width={20} height={20} />}
      variant="white"
    >
      Continue with Google
    </Button>
  );
}
