import * as z from 'zod';
import { useCallback, useState, FC } from 'react';
import { useRouter } from 'next/router';

import { emailLogin } from '@nifty/client/features/auth/api';
import { GoogleLogin } from './google-login';

const schema = z.object({
  email: z.string().email(),
});

enum SentStatus {
  NotSent,
  Sent,
  Error,
}

const LoginForm: FC = ({}) => {
  const router = useRouter();
  const [sentStatus, setSentStatus] = useState<SentStatus>(SentStatus.NotSent);

  const handleSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      try {
        await emailLogin({ email: values.email }, router.query);
        setSentStatus(SentStatus.Sent);
      } catch (error) {
        setSentStatus(SentStatus.Error);
      }
    },
    [setSentStatus]
  );

  if (sentStatus === SentStatus.Sent) {
    return (
      <div className="text-center text-gray-500">
        We&apos;ve sent you a temporary login link. Please check your email to
        log in.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-5xl mb-5">Post!</h1>
        <GoogleLogin />
        {/* <p>or</p>
        <Form<LoginFormData, typeof schema> schema={schema} onSubmit={handleSubmit}>
          {({ register, formState }) => (
            <>
              <InputField
                type="email"
                label="Email Address"
                error={formState.errors['email']}
                registration={register('email')}
              />
              <div>
                <Button type="submit" className="w-full">
                  Log in
                </Button>
              </div>
            </>
          )}
        </Form> */}
      </div>
    </>
  );
};

export default LoginForm;
