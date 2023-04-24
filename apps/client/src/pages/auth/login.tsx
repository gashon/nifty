import { lazy } from 'react';
import {
  EmailLogin,
  GoogleLogin,
  GithubLogin,
  AuthProvider,
} from '@/features/auth';
import ThemeLayout from '@/layouts/theme';

import { Brand } from '@nifty/ui/atoms';

export default function Login() {
  return (
    <AuthProvider>
      <ThemeLayout>
        <main className="bg-primary flex min-h-screen items-center justify-center px-6 md:px-0">
          <div className="flex flex-col items-center">
            <Brand size={50} />
            <h1 className="text-primary mt-3 text-center text-2xl font-extrabold md:text-3xl">
              Welcome to Niftie!
            </h1>
            <p className="text-tertiary max-w-sm pt-2 text-center text-sm md:text-base">
              Enter your email address or use one of the social media options to
              log back in or register!
            </p>
            <EmailLogin />
            <div className="my-3 flex items-center justify-between md:my-6">
              <span className="inline-block h-[1px] w-12 bg-zinc-700" />
              <p className="mx-3 text-zinc-700 dark:text-zinc-300">OR</p>
              <span className="inline-block h-[1px] w-12 bg-zinc-700" />
            </div>
            <div className="flex w-full flex-col items-stretch gap-3">
              <GithubLogin />
              <GoogleLogin />
            </div>
          </div>
        </main>
      </ThemeLayout>
    </AuthProvider>
  );
}
