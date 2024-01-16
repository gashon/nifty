import * as z from 'zod';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState, useCallback } from 'react';
import ThemeLayout from '@/layouts/theme';
import { subscribeUser } from '@/features/user';
import { AuthProvider } from '@/features/auth';

import { Modal } from '@nifty/ui/molecules/modal';
import { Navbar } from '@nifty/ui/templates/Navbar';
import { Form, InputField } from '@nifty/ui/form';

const schema = z.object({
  email: z.string().email(),
});

type EmailFormData = { email: string };

const EmailForm: FC<{ setIsOpen: Dispatch<SetStateAction<boolean>> }> = ({
  setIsOpen,
}) => {
  const onSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      const res = await subscribeUser(values.email);
      // @ts-ignore
      const status = res.status || res?.response?.status;
      if (status !== 201) return;

      setIsOpen(true);
    },
    [setIsOpen]
  );

  return (
    <Form<EmailFormData, typeof schema>
      className={
        'h-auto flex min-w-full flex-col rounded-lg bg-zinc-200 shadow-md dark:bg-zinc-800 md:min-w-[50ch] md:flex-row md:rounded-full'
      }
      schema={schema}
      onSubmit={onSubmit}
    >
      {({ formState, register }) => (
        <>
          <input
            type="email"
            placeholder="Email Address"
            {...register('email')}
            className="text-black peer transition-colors flex-1 rounded-lg border-none bg-transparent py-3 pl-6 text-sm outline-none placeholder:text-zinc-500 md:rounded-l-full"
          />
          <button
            type="submit"
            style={{ margin: 0 }}
            className="flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-white bg-zinc-600 rounded-lg md:rounded-r-full md:w-auto"
          >
            Notify me
          </button>
        </>
      )}
    </Form>
  );
};

type LandingProps = {
  onWaitListFormSubmit: (email: string) => Promise<void>;
};

const Landing: FC<LandingProps> = ({ onWaitListFormSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeLayout>
      <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-zinc-900">
        <main className="container mx-auto px-6 py-8 md:px-0">
          <Navbar />
          <header className="pt-24 text-center">
            <h1 className="text-primary text-3xl font-extrabold md:text-3xl lg:text-4xl xl:text-5xl">
              Rethinking memory retention.
            </h1>
            <p className="mx-auto max-w-2xl mt-4 text-sm text-tertiary md:text-base">
              Unlock your note's full potential with our AI-powered
              improvements.
            </p>
            <div className="mt-12 flex flex-col items-center">
              {/* <EmailForm setIsOpen={setIsOpen} /> */}
              <Modal
                image="/waitlist-illustration.svg"
                alt="waitlist illustration"
                title="You're on the waiting list!"
                description="We will send you an email as soon as Nifty is ready.
                          Thanks for your interest 🤟"
                open={isOpen}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </header>
          <div className="mx-auto max-w-5xl pt-36 md:pt-60">
            <div
              className="w-auto h-auto "
              style={{
                boxShadow: '0px 0px 57px 13px rgba(255, 255, 255, 0.2)',
                backgroundColor: 'transparent',
                borderRadius: '15px',
              }}
            >
              <Image
                src="/preview.png"
                alt="Preview"
                width={1920}
                height={1080}
                priority={true}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeLayout>
  );
};

export default Landing;
