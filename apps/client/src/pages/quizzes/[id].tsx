import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';

import { AuthProtection, AuthProvider, getUser } from '@/features/auth';
import { QuizForm } from '@/features/quiz';
import { LoadingPage } from '@nifty/ui/pages/loading';

function Document({ user }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const { id, title } = router.query;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof window === 'undefined') return null;

  return (
    <>
      <NextSeo title={title as string} noindex />
      <AuthProvider preloadedUser={user}>
        <AuthProtection loadingComponent={<LoadingPage />}>
          <header className="fixed w-full p-5">
            <button className="cursor-pointer" onClick={() => router.back()}>
              <BsArrowBarLeft size={25} />
            </button>
          </header>
          <div className="flex items-center justify-center w-screen">
            <div className="flex flex-col order-1 p-16 w-full lg:w-2/3">
              <h1 className="underline mb-12 text-5xl text-primary dark:text-zinc-400 ">
                {title}
              </h1>
              <main className="h-screen">
                <QuizForm id={id as string} />
              </main>
            </div>
          </div>
        </AuthProtection>
      </AuthProvider>
    </>
  );
}

export async function getServerSideProps(context) {
  const { data: user } = await getUser(context.req.headers);

  if (!user) {
    return {
      redirect: {
        // destination: `/error/external?message=${encodeURIComponent("You are not logged in!")}&redirect=%2Fnotes%2F${context.params.id}`,
        destination: `/error/external?message=${encodeURIComponent(
          'You are not logged in!'
        )}&${new URLSearchParams({
          redirect: `/quizzes/${context.params.id}`,
        })}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}

export default Document;
