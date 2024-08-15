import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useState, useEffect, FC } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';

import {
  AuthProtection,
  AuthProvider,
  getUser,
} from '@nifty/client/features/auth';
import { QuizForm, getQuiz } from '@nifty/client/features/quiz';
import { LoadingPage } from '@nifty/ui/pages/loading';
import { Quiz, Selectable, User } from '@nifty/common/types';
import { useIsMounted } from '@nifty/client/hooks/use-is-mounted';
import type { GetQuizByIdResponse } from '@nifty/api/domains/quiz/dto';

export const QuizPage: FC<{
  user: Selectable<User>;
  quiz: GetQuizByIdResponse['data'];
}> = ({ user, quiz }) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { id, title } = router.query;

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
              <main className="h-min-screen">
                <QuizForm
                  quizId={id as string}
                  multipleChoiceQuestions={quiz?.multipleChoiceQuestions}
                  freeResponseQuestions={quiz?.freeResponseQuestions}
                />
              </main>
            </div>
          </div>
        </AuthProtection>
      </AuthProvider>
    </>
  );
};

export async function getServerSideProps(context) {
  const [userSettle, quizSettle] = await Promise.allSettled([
    getUser(context.req.headers),
    getQuiz(context.params.id, context.req.headers),
  ]);

  const user =
    userSettle.status === 'fulfilled' ? userSettle.value?.data : null;
  const quiz =
    quizSettle.status === 'fulfilled' ? quizSettle.value?.data : null;

  if (!user || !quiz) {
    return {
      redirect: {
        // destination: `/error/external?message=${encodeURIComponent("You are not logged in!")}&redirect=%2Fnotes%2F${context.params.id}`,
        destination: `/error/external?message=${encodeURIComponent(
          !user ? 'You are not logged in!' : "This quiz doesn't exist!"
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
      quiz,
    },
  };
}

export default QuizPage;
