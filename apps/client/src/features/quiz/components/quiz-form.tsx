import { memo, FC, useRef, useCallback, useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

import { Button } from '@nifty/ui/atoms';
import { IQuizQuestion } from '@nifty/server-lib/models/quiz';
import { IQuizSubmissionAnswer } from '@nifty/server-lib/models/submission';
import { useQuizSession, useCreateSubmission } from '@/features/quiz';

type QuizQuestion = Omit<IQuizQuestion, 'correct_index'>;

// todo: turn into switch for different types of questions
const QuizQuestion: FC<{
  question: QuizQuestion;
  onAnswerChange: (id: string, answerIndex: number) => void;
}> = ({ question, onAnswerChange }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const handleAnswerChange = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    onAnswerChange(question.id, answerIndex);
  };

  return (
    <div className="w-full flex justify-center flex-col mt-5">
      <p className="text-xl underline mb-1">{question.question}</p>
      {question.answers &&
        question.answers.map((answer, index) => (
          <label key={index} className="cursor-pointer text-lg">
            <input
              className="mr-2"
              type="radio"
              name={`answer-${question.id}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => handleAnswerChange(index)}
            />
            {answer}
          </label>
        ))}
    </div>
  );
};

const MemoizedQuizQuestion = memo(QuizQuestion);

export const QuizForm: FC<{ questions: QuizQuestion[]; quizId: string }> = ({
  questions,
  quizId,
}) => {
  const submitQuizMutation = useCreateSubmission(quizId);
  const { getTotalTime, startSession, deleteSessions } = useQuizSession(quizId);
  const [answers, setAnswers] = useState<IQuizSubmissionAnswer[]>(
    questions.map((question) => ({
      question_id: question.id,
      answer_index: -1,
      type: question.type,
    }))
  );
  const { handleSubmit, formState } = useForm();

  useEffect(() => {
    startSession();
  }, [startSession]);

  const onAnswerChange = useCallback(
    (questionId: string, answerIndex: number) => {
      setAnswers((prevAnswers): IQuizSubmissionAnswer[] => {
        const answer = prevAnswers.find((a) => a.question_id === questionId);
        if (answer) {
          // update answer index
          return prevAnswers.map((a) =>
            a.question_id === questionId
              ? { ...a, answer_index: answerIndex }
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
    console.log('payload', payload);
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
          {questions.map((question) => (
            <div className="mb-5">
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
