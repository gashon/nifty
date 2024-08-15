import { memo, FC, useRef, useCallback, useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

import { Button } from '@nifty/ui/atoms';
import type {
  MultipleChoiceQuestion,
  QuizQuestionFreeResponse,
  QuizQuestionMultipleChoice,
  Selectable,
} from '@nifty/common/types';
import type {
  QuizAnswers,
  QuizFreeResponseAnswer,
  QuizMultipleChoiceAnswer,
} from '@nifty/api/domains/quiz/dto';

import {
  useQuizSession,
  useCreateSubmission,
} from '@nifty/client/features/quiz';

const MultipleChoice: FC<{
  question: Selectable<QuizQuestionMultipleChoice>;
  onAnswerChange: (questionId: number, userAnswerIndex: number) => void;
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
  question: Selectable<QuizQuestionFreeResponse>;
  onAnswerChange: (questionId: number, userAnswer: string) => void;
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

// todo migrate to formik
export const QuizForm: FC<{
  multipleChoiceQuestions?: Selectable<QuizQuestionMultipleChoice>[];
  freeResponseQuestions?: Selectable<QuizQuestionFreeResponse>[];
  quizId: string;
}> = ({ multipleChoiceQuestions, freeResponseQuestions, quizId }) => {
  const submitQuizMutation = useCreateSubmission(quizId);
  const { getTotalTime, startSession, deleteSessions } = useQuizSession(quizId);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<
    QuizMultipleChoiceAnswer[]
  >(
    (multipleChoiceQuestions ?? []).map((question) => ({
      questionId: question.id,
      answerIndex: -1,
    }))
  );
  const [freeResponseAnswers, setFreeResponseAnswers] = useState<
    QuizFreeResponseAnswer[]
  >(
    (freeResponseQuestions ?? []).map((question) => ({
      questionId: question.id,
      answerText: '',
    }))
  );
  const { handleSubmit, formState } = useForm();

  useEffect(() => {
    startSession();
  }, [startSession]);

  const onMultipleChoiceAnswerChange = useCallback(
    (questionId: number, userAnswerIndex: number) => {
      setMultipleChoiceAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, answerIndex: userAnswerIndex }
            : answer
        )
      );
    },
    []
  );

  const onFreeResponseAnswerChange = useCallback(
    (questionId: number, userAnswer: string) => {
      setFreeResponseAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, answerText: userAnswer }
            : answer
        )
      );
    },
    []
  );

  const onSubmit = useCallback(async () => {
    const payload = {
      answers: {
        multipleChoice: multipleChoiceAnswers,
        freeResponse: freeResponseAnswers,
      },
      quizId: quizId,
      timeTaken: getTotalTime(),
    };
    const { data } = await submitQuizMutation.mutateAsync(payload);
    // clean up localStorage
    deleteSessions();
    // redirect to submissions page
    window.location.replace(`/quizzes/submissions/${data.id}`);
  }, [multipleChoiceAnswers, freeResponseAnswers]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col align-center justify-center"
      >
        <>
          {multipleChoiceQuestions &&
            multipleChoiceQuestions.map((question, index) => (
              <div
                className="mb-5 flex flex-col"
                key={`question-${question.id}`}
              >
                <div className="flex flex-row mb-2 text-xl">
                  <p className="opacity-75 mr-1">{index + 1}. </p>
                  <p> {question.question}</p>
                </div>
                <MultipleChoice
                  question={question}
                  onAnswerChange={onMultipleChoiceAnswerChange}
                />
              </div>
            ))}
          {freeResponseQuestions &&
            freeResponseQuestions.map((question, index) => (
              <div
                className="mb-5 flex flex-col"
                key={`question-${question.id}`}
              >
                <div className="flex flex-row mb-2 text-xl">
                  <p className="opacity-75 mr-1">{index + 1}. </p>
                  <p> {question.question}</p>
                </div>
                <FreeResponse
                  question={question}
                  onAnswerChange={onFreeResponseAnswerChange}
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
