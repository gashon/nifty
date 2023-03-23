import { Field, Form, Formik, FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { Button, Text } from '@/components/elements';
import { InputField } from '@/components/form';
import { login } from '@/features/auth/api';

enum SentStatus {
  NotSent,
  Sent,
  Error,
}

export default function EmailLogin() {
  const router = useRouter();
  const [sentStatus, setSentStatus] = useState<SentStatus>(SentStatus.NotSent);

  const handleSubmit = useCallback(
    (values: FormikValues) => {
      console.log('handleSubmit', values);
      // login({ email }, router.query);
      setSentStatus(SentStatus.Sent);
    },
    [router.query]
  );

  if (sentStatus === SentStatus.Sent) {
    return (
      <Text as="div" align="center" color="gray">
        We&apos;ve sent you a temporary login link. Please check your email to log in.
      </Text>
    );
  }

  return (
    <Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="w-full max-w-xs mx-auto">
          <div className="inline-flex text-left w-full">
            <Field
              as={InputField}
              size="xl"
              name="email"
              placeholder="Email address"
              autoFocus
              type="email"
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full mt-5"
            loading={isSubmitting}
          >
            Continue
          </Button>
        </Form>
      )}
    </Formik>
  );
}
