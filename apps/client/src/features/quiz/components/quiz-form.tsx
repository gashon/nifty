import { memo, FC, useCallback, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

// import { useSubmitQuiz } from '@/features/quiz';

import { Button } from '@nifty/ui/atoms';
import {
  // QuizSubmitRequest,
  IQuizQuestion,
} from '@nifty/server-lib/models/quiz';

type QuizQuestion = Omit<IQuizQuestion, 'correct_index'>;
type QuizAnswer = Pick<IQuizQuestion, 'id'> & {
  answer_index: number;
};
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
      <p>{question.question}</p>
      {question.answers &&
        question.answers.map((answer, index) => (
          <label key={index}>
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

export const QuizForm: FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  // const submitQuizMutation = useSubmitQuiz();
  console.log('GOT', questions);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const { handleSubmit, formState } = useForm();

  const onAnswerChange = useCallback((id: string, answerIndex: number) => {
    setAnswers((prevAnswers) => {
      const answer = prevAnswers.find((a) => a.id === id);
      if (answer) {
        return prevAnswers.map((a) =>
          a.id === id ? { ...a, answer_index: answerIndex } : a
        );
      }
      return [...prevAnswers, { id, answer_index: answerIndex }];
    });
  }, []);

  const onSubmit = useCallback(async () => {
    console.log(answers);
  }, [answers]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col align-center justify-center"
      >
        <>
          {questions.map((question) => (
            <MemoizedQuizQuestion
              key={question.id}
              question={question}
              onAnswerChange={onAnswerChange}
            />
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
