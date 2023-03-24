import * as z from 'zod';
import { useRouter } from 'next/router';
import { useState, useCallback, FC } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import { login } from '@/features/auth/api';
import { LoginFormData } from '../types';

import { Button } from '@ui/atoms';
import { InputField, Form } from '@ui/form';

const schema = z.object({
  email: z.string().email(),
});

enum SentStatus {
  NotSent,
  Sent,
  Error,
}

export const EmailLogin: FC = () => {
  const router = useRouter();
  const [sentStatus, setSentStatus] = useState<SentStatus>(SentStatus.NotSent);

  const onMagicLinkLogin = useCallback(
    async (values: z.infer<typeof schema>) => {
      await login({ email: values.email }, router.query);
      setSentStatus(SentStatus.Sent);
    },
    [router.query, setSentStatus]
  );

  return (
    <>
      {sentStatus === SentStatus.Sent && (
        <h1>We&apos;ve sent you a temporary login link. Please check your email to log in.</h1>
      )}
      <Form<LoginFormData, typeof schema> schema={schema} onSubmit={onMagicLinkLogin}>
        {({ formState, register }) => (
          <>
            <div className="inline-flex text-left w-full">
              <InputField
                type="email"
                label="Email Address"
                error={formState.errors['email']}
                registration={register('email')}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              icon={
                <FiArrowRight
                  strokeWidth={3}
                  // check if email is valid, disable otherwise
                />
              }
            >
              Continue
            </Button>
          </>
        )}
      </Form>
    </>
  );
};
