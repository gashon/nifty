import { memo, FC, useRef, useCallback, useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

import { Button } from '@nifty/ui/atoms';
import {
  IMultipleChoiceQuizQuestion,
  IFreeResponseQuizQuestion,
} from '@nifty/server-lib/models/quiz';
import { IQuizSubmissionAnswer } from '@nifty/server-lib/models/submission';
import { useQuizSession, useCreateSubmission} from '@nifty/client/features/quiz';

type QuizQuestion =
  | Omit<IMultipleChoiceQuizQuestion, 'correct_index'>
  | IFreeResponseQuizQuestion;

const MultipleChoice: FC<{
  question: Extract<QuizQuestion, { type: 'multiple-choice' }>;
  onAnswerChange: (id: string, userAnswer: number) => void;
}> = ({ question, onAnswerChange }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  return (
    <>
      {question.answers &&
        question.answers.map((answer, index) => (
          <div
            key={`multiple-choice-${index}`}
            className={`cursor-pointer text-lg border-green 
            ${selectedAnswer === index ? '' : 'opacity-75'}
          `}
            onClick={() => {
              setSelectedAnswer(index);
              onAnswerChange(question.id, index);
            }}
          >
            <span className="opacity-50 mr-2">
              {String.fromCharCode(index + 97)}.
            </span>

            <span
              className={`${
                index === selectedAnswer ? 'bg-secondary text-secondary' : ''
              }`}
            >
              {answer}
            </span>
          </div>
        ))}
    </>
  );
};

const FreeResponse: FC<{
  question: Extract<QuizQuestion, { type: 'free-response' }>;
  onAnswerChange: (id: string, userAnswer: string) => void;
}> = ({ question, onAnswerChange }) => {
  return (
    <>
      <textarea
        key={`free-response-${question.id}`}
        className="w-full h-28 p-2 text-primary opacity-75 rounded bg-transparent border-none"
        placeholder="Answer..."
        onChange={(e) => {
          onAnswerChange(question.id, e.target.value);
        }}
      />
    </>
  );
};

const QuizQuestion: FC<{
  question: QuizQuestion;
  onAnswerChange: (id: string, userAnswer: number | string) => void;
}> = ({ question, onAnswerChange }) => {
  if (question.type === 'free-response')
    return <FreeResponse question={question} onAnswerChange={onAnswerChange} />;

  return <MultipleChoice question={question} onAnswerChange={onAnswerChange} />;
};

const MemoizedQuizQuestion = memo(QuizQuestion);

// todo migrate to formik
export const QuizForm: FC<{ questions: QuizQuestion[]; quizId: string }> = ({
  questions,
  quizId,
}) => {
  const submitQuizMutation = useCreateSubmission(quizId);
  const { getTotalTime, startSession, deleteSessions } = useQuizSession(quizId);
  const [answers, setAnswers] = useState<IQuizSubmissionAnswer[]>(
    questions.map((question) => {
      return question.type === 'multiple-choice'
        ? {
            question_id: question.id,
            answer_index: -1,
            type: question.type,
          }
        : {
            question_id: question.id,
            answer_text: '',
            type: question.type,
          };
    })
  );
  const { handleSubmit, formState } = useForm();

  useEffect(() => {
    startSession();
  }, [startSession]);

  const onAnswerChange = useCallback(
    (questionId: string, userAnswer: string | number) => {
      setAnswers((prevAnswers): IQuizSubmissionAnswer[] => {
        const answer = prevAnswers.find((a) => a.question_id === questionId);
        if (answer) {
          if (answer.type === 'free-response') {
            return prevAnswers.map((a) =>
              a.question_id === questionId
                ? { ...a, answer_text: userAnswer as string }
                : a
            );
          }
          // update answer index
          return prevAnswers.map((a) =>
            a.question_id === questionId
              ? { ...a, answer_index: userAnswer as number }
              : a
          );
        }
        return prevAnswers;
      });
    },
    []
  );

  const onSubmit = useCallback(async () => {
    const payload = {
      answers,
      quiz_id: quizId,
      time_taken: getTotalTime(),
    };
    const { data } = await submitQuizMutation.mutateAsync(payload);
    // clean up localStorage
    deleteSessions();
    // redirect to submissions page
    window.location.replace(`/quizzes/submissions/${data.id}`);
  }, [answers]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col align-center justify-center"
      >
        <>
          {questions.map((question, index) => (
            <div className="mb-5 flex flex-col" key={`question-${question.id}`}>
              <div className="flex flex-row mb-2 text-xl">
                <p className="opacity-75 mr-1">{index + 1}. </p>
                <p> {question.question}</p>
              </div>

              <MemoizedQuizQuestion
                key={question.id}
                question={question}
                onAnswerChange={onAnswerChange}
              />
            </div>
          ))}
          <div className="mt-5 w-full flex justify-end">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              loading={formState.isSubmitting}
            >
              <FiArrowRight />
            </Button>
          </div>
        </>
      </form>
    </>
  );
};

export default QuizForm;
