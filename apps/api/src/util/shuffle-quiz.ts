import { MultipleChoiceQuestion } from '@nifty/common/types';

export function shuffleQuiz(
  questions: { question: string; answers: string[] }[]
): MultipleChoiceQuestion[] {
  return questions.map((question: any, index: number) => {
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
    correctIndex = answers.findIndex(
      (answer: any) => answer === question.answers[correctIndex]
    );
    return {
      question: question.question,
      answers: answers,
      correctIndex: correctIndex,
    };
  });
}
