import { ThemeSelection } from '@/components/theme-selection/theme-selection';
import { EmailLogin, GoogleLogin, GithubLogin } from '@/features/auth/components';

import { Brand } from '@ui/atoms';

export default function Login() {
  return (
    <main className="bg-primary flex min-h-screen items-center justify-center px-6 md:px-0">
      <div className="flex flex-col items-center">
        <Brand size={50} />
        <h1 className="text-primary mt-3 text-center text-2xl font-extrabold md:text-3xl">
          Welcome to HiveNote!
        </h1>
        <ThemeSelection />
        <p className="text-tertiary max-w-sm pt-2 text-center text-sm md:text-base">
          Enter your email address or use one of the social media options to log back in or
          register!
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
        {/* {error === 'Not approved' && (
          <Modal
            title="Authentication denied"
            description="You have not been approved for early access just yet, we will let you know when you can sign in 🙌"
            image="/auth-denied.svg"
            alt="sad illustration"
            open={isErrorModalOpen}
            onClose={() => setErrorModalOpen(false)}
          />
        )} */}
      </div>
    </main>
  );
}
