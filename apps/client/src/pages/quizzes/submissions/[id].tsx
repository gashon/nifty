import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useState, useEffect, FC } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';
import dayjs from 'dayjs';

import { AuthProtection, AuthProvider, getUser } from '@/features/auth';
import { getQuizSubmission } from '@/features/quiz';
import { LoadingPage } from '@nifty/ui/pages/loading';
import { IUser } from '@nifty/server-lib/models/user';
import {
  ISubmission,
  ISubmissionAnswer,
  IFreeResponseSubmissionAnswer,
  IMultipleChoiceSubmissionAnswer,
} from '@nifty/server-lib/models/submission';
import {
  IQuiz,
  IQuizMultipleChoiceQuestion,
  IQuizFreeResponseQuestion,
} from '@nifty/server-lib/models/quiz';

interface SubmissionResponse extends Omit<ISubmission, 'quiz'> {
  quiz: IQuiz; // quiz is populated
}

const MultipleChoice: FC<{
  answer: IMultipleChoiceSubmissionAnswer;
  quizQuestion: IQuizMultipleChoiceQuestion;
}> = ({ answer, quizQuestion }) => {
  return (
    <>
      <p className="">
        <span className="">Correct Answer:</span>{' '}
        {quizQuestion.answers[answer.correct_index]}
      </p>

      <p className="">
        {answer.is_correct
          ? 'Correct!'
          : `Your answer: ${
              quizQuestion.answers[answer.answer_index] ?? 'None'
            }`}
      </p>
    </>
  );
};

const FreeResponse: FC<{
  answer: IFreeResponseSubmissionAnswer;
  quizQuestion: IQuizFreeResponseQuestion;
}> = ({ answer, quizQuestion }) => {
  return (
    <>
      <p className="opacity-75">
        <span className="">Your answer:</span> {answer.answer_text ?? 'None'}
      </p>

      <p className="">
        <span className="">Feedback:</span> {answer.feedback_text}
      </p>
    </>
  );
};

const SubmissionResults: FC<{
  submission: SubmissionResponse;
}> = ({ submission }) => {
  const getQuizQuestions = (questionId: string) => {
    return submission.quiz.questions.find(
      (question) => question.id === questionId
    );
  };

  return (
    <>
      {submission.grades.map((answer) => {
        const quizQuestion = getQuizQuestions(answer.question_id);

        let QuestionComponent = null;
        if (!quizQuestion) return null;
        else if (
          quizQuestion.type === 'multiple-choice' &&
          answer.type === 'multiple-choice'
        )
          QuestionComponent = MultipleChoice;
        else if (
          quizQuestion.type === 'free-response' &&
          answer.type === 'free-response'
        )
          QuestionComponent = FreeResponse;

        return (
          <div
            key={answer.question_id}
            className={`text-primary flex flex-col p-4 mb-4 rounded-md`}
            style={{
              opacity: 0.95,
            }}
          >
            <div className="flex flex-row justify-between mb-4">
              <h3 className=" text-xl">{quizQuestion.question}</h3>

              <p
                className={` ${
                  answer.is_correct
                    ? 'text-green-400 text:bg-green-100'
                    : 'text-red-400 text:bg-red-100'
                }`}
              >
                {answer.is_correct ? 'Correct!' : 'Incorrect'}
              </p>
            </div>

            <QuestionComponent answer={answer} quizQuestion={quizQuestion} />
          </div>
        );
      })}
    </>
  );
};

export const SubmissionPage: FC<{
  user: IUser;
  submission: SubmissionResponse;
}> = ({ user, submission }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
                {/* Round to two decimals */}
                <section className="h-full flex flex-col justify-end">
                  <p className="opacity-75">
                    Score: {Math.round(submission.score * 100) / 100}%
                  </p>
                  <p className="opacity-75">
                    Time Taken: {/* Use Dayjs */}
                    {dayjs
                      .duration(
                        Math.round((submission.time_taken / 1000) * 100) / 100,
                        'seconds'
                      )
                      .format('mm:ss')}{' '}
                    min
                  </p>
                </section>
              </div>
              <main className="h-auto mt-10">
                <SubmissionResults submission={submission} />
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

export default SubmissionPage;
