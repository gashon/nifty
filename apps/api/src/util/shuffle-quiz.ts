import { v4 as uuid } from 'uuid';
import { IMultipleChoiceQuizQuestion } from '@nifty/server-lib/models/quiz';

export function shuffleQuiz(questions: IMultipleChoiceQuizQuestion[]): IMultipleChoiceQuizQuestion[] {
  return questions.map((question: any) => {
    // shallow copy
    const answers = [...question.answers];
    // initially, 0 index is correct
    let correctIndex = 0;
    // shuffle the answers
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    // find the correct index
    correctIndex = answers.findIndex((answer: any) => answer === question.answers[correctIndex]);
    return {
      id: uuid(),
      type: "multiple-choice",
      question: question.question,
      answers: answers,
      correct_index: correctIndex,
    }
  });
}