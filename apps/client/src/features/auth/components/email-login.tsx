import * as z from 'zod';
import { useRouter } from 'next/router';
import { useState, useCallback, FC } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import { LoginFormData, LoginFormSchema } from '../types';

import { Button } from '@nifty/ui/atoms';
import { InputField, Form } from '@nifty/ui/form';

const schema = z.object({
  email: z.string().email(),
});

export enum SentStatus {
  NotSent,
  Sent,
  Error,
}

export const EmailLogin: FC = () => {
  const router = useRouter();
  const [sentStatus, setSentStatus] = useState<SentStatus>(SentStatus.NotSent);

  const onMagicLinkLogin = useCallback(
    async (values: z.infer<typeof schema>) => {
      const { status } = await login({ email: values.email }, router.query);
      if (status !== 200) setSentStatus(SentStatus.Error);
      else setSentStatus(SentStatus.Sent);
    },
    [router.query, setSentStatus]
  );

  return (
    <>
      <Form<LoginFormData, typeof LoginFormSchema>
        schema={LoginFormSchema}
        onSubmit={onMagicLinkLogin}
        className="w-full flex flex-col align-center justify-center"
      >
        {({ formState, register, getValues }) => (
          <>
            {sentStatus === SentStatus.Sent && (
              <p className="mt-3">
                We&apos;ve sent you a temporary login link. Please check your{' '}
                <span className="underline">
                  <a href={`mailto:${getValues().email}`}>email</a>
                </span>{' '}
                to log in.
              </p>
            )}
            <div className="inline-flex text-left w-full mt-5" style={{ marginBottom: -5 }}>
              <InputField
                type="email"
                label="Email Address"
                error={formState.errors['email']}
                registration={register('email')}
                disabled={sentStatus === SentStatus.Sent}
              />
            </div>
            {sentStatus !== SentStatus.Sent && (
              <Button
                type="submit"
                variant="primary"
                loading={formState.isSubmitting}
                icon={<FiArrowRight strokeWidth={3} />}
              >
                Continue
              </Button>
            )}
          </>
        )}
      </Form>
    </>
  );
};
