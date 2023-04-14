import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useState, useEffect, FC } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';

import { AuthProtection, AuthProvider, getUser } from '@/features/auth';
import { getQuizSubmission } from '@/features/quiz';
import { LoadingPage } from '@nifty/ui/pages/loading';
import { IUser } from '@nifty/server-lib/models/user';
import { ISubmission } from '@nifty/server-lib/models/submission';
import { IQuiz } from '@nifty/server-lib/models/quiz';

interface SubmissionResponse extends Omit<ISubmission, 'quiz'> {
  quiz: IQuiz; // quiz is populated
}

export const QuizPage: FC<{
  user: IUser;
  submission: SubmissionResponse;
}> = ({ user, submission }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof window === 'undefined') return null;

  const getQuizQuestions = (questionId: string) => {
    return submission.quiz.questions.find(
      (question) => question.id === questionId
    );
  };

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
                {/* Round to two decimals */}
                <h4 className="opacity-75">
                  Score: {Math.round(submission.score * 100) / 100}%
                </h4>
              </div>
              <main className="h-auto mt-10">
                {submission.answers.map((answer, index) => {
                  const quizQuestion = getQuizQuestions(answer.question_id);

                  return (
                    <div
                      key={index}
                      className={`text-black flex flex-col p-4 mb-4 rounded-md shadow-md ${
                        answer.is_correct
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      }`}
                      style={{
                        opacity: 0.95,
                      }}
                    >
                      <h3 className="mb-2 text-xl font-bold">
                        {quizQuestion.question}
                      </h3>

                      <p className="mb-2">
                        <span className="font-bold">Correct Answer:</span>{' '}
                        {quizQuestion.answers[answer.correct_index]}
                      </p>

                      <p className="mb-2">
                        {answer.is_correct
                          ? 'Correct!'
                          : `Your answer: ${
                              quizQuestion.answers[answer.answer_index]
                            }`}
                      </p>
                    </div>
                  );
                })}
              </main>
              <div className="w-full flex justify-end">
                <Link href={`/quizzes/${submission.quiz.id}`}>
                  <span className="underline opacity-75">Try again</span>
                </Link>
              </div>
            </div>
          </div>
        </AuthProtection>
      </AuthProvider>
    </>
  );
};

export async function getServerSideProps(context) {
  const [{ data: user }, { data: submission }] = await Promise.all([
    getUser(context.req.headers),
    getQuizSubmission(context.params.id, context.req.headers),
  ]);

  if (!user || !submission) {
    return {
      redirect: {
        // destination: `/error/external?message=${encodeURIComponent("You are not logged in!")}&redirect=%2Fnotes%2F${context.params.id}`,
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

export default QuizPage;
