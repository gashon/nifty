import { useEffect, useState, useRef } from "react";
import { IQuizSubmissionAnswer } from "@nifty/server-lib/models/submission";
import { QuizQuestion } from "@/features/quiz";
import storage from "@/lib/storage";

export const useQuizStorage = (quizId: string, questions: QuizQuestion[]) => {
  const [answers, setAnswers] = useState<IQuizSubmissionAnswer[]>([]);
  const hasMounted = useRef(false);
  const storageKey = `quiz_storage:${quizId}`;

  // Load the answers from local storage
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const answers = storage.get<IQuizSubmissionAnswer[]>(storageKey);
    if (answers)
      return setAnswers(answers);

    const initialAnswers = questions.map((question) => {
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
    storage.set<IQuizSubmissionAnswer[]>(storageKey, initialAnswers);
    setAnswers(initialAnswers);
  }, [storageKey]);

  const saveAnswers = (answers: IQuizSubmissionAnswer[]) => {
    storage.set<IQuizSubmissionAnswer[]>(storageKey, answers);
  }

  const deleteAnswers = () => {
    storage.remove(storageKey);
  }

  return {
    saveAnswersToStorage: saveAnswers,
    answers,
    setAnswers,
    deleteAnswers
  }
}
