import { useCallback, FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '@ui/atoms';

export const GoogleLogin: FC = () => {
  const router = useRouter();
  const redirect = (router.query.redirect as string) || '/d';

  const onGoogleLogin = useCallback(() => {
    window.location.href = `/ajax/auth/login/google?${new URLSearchParams({
      ...router.query,
      redirect,
    }).toString()}`;
  }, [router, redirect]);

  return (
    <Button
      onClick={onGoogleLogin}
      icon={<Image src="/Google__G__Logo.svg" alt="Google logo" width={20} height={20} />}
      variant="white"
    >
      Continue with Google
    </Button>
  );
};
