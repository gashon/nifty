import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useState, useEffect, FC } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';
import dayjs from 'dayjs';

import {
  AuthProtection,
  AuthProvider,
  getUser,
} from '@nifty/client/features/auth';
import { getQuizSubmission, useRemixQuiz } from '@nifty/client/features/quiz';
import { LoadingPage } from '@nifty/ui/pages/loading';
import { Button } from '@nifty/ui/atoms';
import { Selectable, User } from '@nifty/common/types';
import { useIsMounted } from '@nifty/client/hooks/use-is-mounted';
import type { GetQuizSubmissionByIdResponse } from '@nifty/api/domains/quiz/dto';

const MultipleChoice: FC<{
  answer: GetQuizSubmissionByIdResponse['data']['answers']['multipleChoiceAnswers'][number];
}> = ({ answer }) => {
  return (
    <>
      <p className="">
        <span className="">Correct Answer:</span>{' '}
        {answer.answers[answer.correctIndex]}
      </p>

      <p className="">
        {answer.isCorrect
          ? 'Correct!'
          : `Your answer: ${answer.answerIndex ?? 'None'}`}
      </p>
    </>
  );
};

const FreeResponse: FC<{
  answer: GetQuizSubmissionByIdResponse['data']['answers']['freeResponseAnswers'][number];
}> = ({ answer }) => {
  return (
    <>
      <p className="opacity-75">
        <span className="">Your answer:</span> {answer.answerText ?? 'N/A'}
      </p>

      <p className="">
        <span className="">Feedback:</span> {answer.feedbackText}
      </p>
    </>
  );
};

const SubmissionResult: FC<{
  children: React.ReactNode;
  id: number;
  question: string;
  isCorrect: boolean;
}> = ({ children, question, id, isCorrect }) => {
  return (
    <div
      key={`submission:result:${id}`}
      className={`text-primary flex flex-col p-4 mb-4 rounded-md`}
      style={{
        opacity: 0.95,
      }}
    >
      <div className="flex flex-row justify-between mb-4">
        <h3 className=" text-xl">{question}</h3>

        <p
          className={` ${
            isCorrect
              ? 'text-green-400 text:bg-green-100'
              : 'text-red-400 text:bg-red-100'
          }`}
        >
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </p>
      </div>
      {children}
    </div>
  );
};

export const SubmissionPage: FC<{
  user: Selectable<User>;
  submission: GetQuizSubmissionByIdResponse['data'];
}> = ({ user, submission }) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  // const { mutateAsync: remixQuiz, isLoading: remixIsLoading } = useRemixQuiz(
  //   submission.quizId
  // );

  if (!isMounted || typeof window === 'undefined') return null;

  return (
    <>
      <NextSeo title={'Submission'} noindex />
      <AuthProvider preloadedUser={user}>
        <AuthProtection loadingComponent={<LoadingPage />}>
          <header className="fixed w-full p-5">
            <button className="cursor-pointer" onClick={() => router.back()}>
              <BsArrowBarLeft size={25} />
            </button>
          </header>
          <div className="flex items-center justify-center w-screen">
            <div className="flex flex-col order-1 p-16 w-full lg:w-2/3">
              <div className="flex flex-row justify-between items-end">
                <h1 className="underline text-5xl text-primary dark:text-zinc-400 ">
                  Results
                </h1>
                <section className="h-full flex flex-col justify-end">
                  <p className="opacity-75">
                    Score: {Math.round(submission.score * 100)}%
                  </p>
                  <p className="opacity-75">
                    Time Taken:{' '}
                    {dayjs
                      .duration(
                        Math.round((submission.timeTaken / 1000) * 100) / 100,
                        'seconds'
                      )
                      .format('mm:ss')}{' '}
                    <span style={{ opacity: 0.5 }}>(mm:ss)</span>
                  </p>
                </section>
              </div>
              <main className="h-auto mt-10">
                {submission.answers &&
                  submission.answers.freeResponseAnswers.map((answer) => (
                    <SubmissionResult
                      id={answer.id}
                      question={answer.question}
                      isCorrect={answer.isCorrect}
                    >
                      <FreeResponse answer={answer} />
                    </SubmissionResult>
                  ))}
                {submission.answers &&
                  submission.answers.multipleChoiceAnswers.map((answer) => (
                    <SubmissionResult
                      id={answer.id}
                      question={answer.question}
                      isCorrect={answer.isCorrect}
                    >
                      <MultipleChoice answer={answer} />
                    </SubmissionResult>
                  ))}
              </main>
              <div className="w-full flex justify-between items-end">
                <Link href={`/quizzes/${submission.quizId}`}>
                  <span className="underline opacity-75">Try again</span>
                </Link>
                {/* <Button */}
                {/*   onClick={async () => { */}
                {/*     const payload = { */}
                {/*       question_type: submission.quiz.question_type, */}
                {/*       note: submission.quiz.note, */}
                {/*     }; */}
                {/*     const { data: quizResponse } = await remixQuiz( */}
                {/*       submission.quiz.id, */}
                {/*       payload */}
                {/*     ); */}
                {/*     router.push(`/quizzes/${quizResponse.data.id}`); */}
                {/*   }} */}
                {/*   loading={remixIsLoading} */}
                {/* > */}
                {/*   Create another quiz! */}
                {/* </Button> */}
              </div>
            </div>
          </div>
        </AuthProtection>
      </AuthProvider>
    </>
  );
};

export async function getServerSideProps(context) {
  const [userSettle, submissionSettle] = await Promise.allSettled([
    getUser(context.req.headers),
    getQuizSubmission(context.params.id, context.req.headers),
  ]);

  const user =
    userSettle.status === 'fulfilled' ? userSettle.value?.data : null;
  const submission =
    submissionSettle.status === 'fulfilled'
      ? submissionSettle.value?.data
      : null;

  if (!user || !submission) {
    return {
      redirect: {
        destination: `/error/external?message=${encodeURIComponent(
          !user ? 'You are not logged in!' : "This submission doesn't exist!"
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
      submission,
    },
  };
}

export default SubmissionPage;
