import {
  IQuizQuestion,
  IFreeResponseQuizQuestion,
  IQuizMultipleChoiceQuestion,
  IQuizFreeResponseQuestion,
} from '@nifty/server-lib/models/quiz';
import {
  IQuizSubmissionAnswer,
  IFreeResponseSubmissionGradingResponse,
  IQuizMultipleChoiceAnswer,
  IQuizFreeResponseAnswer,
  IMultipleChoiceSubmissionAnswer,
  IFreeResponseSubmissionAnswer,
} from '@nifty/server-lib/models/submission';
import {
  openaiRequest,
  openaiRequestHandler,
} from '@nifty/api/lib/openai-request';
import {
  QuizAnswers,
  QuizFreeResponseAnswer,
  QuizMultipleChoiceAnswer,
} from '../domains/quiz/dto';
import {
  QuizQuestionFreeResponse,
  QuizQuestionMultipleChoice,
  Selectable,
} from '@nifty/common/types';

type MultipleChoiceQA = {
  question: IQuizMultipleChoiceQuestion;
  answer: IQuizMultipleChoiceAnswer;
};

export type FreeResponseQA = {
  question: IQuizFreeResponseQuestion;
  answer: IQuizFreeResponseAnswer;
};

export function assessMultipleChoiceAnswer(
  question: Selectable<QuizQuestionMultipleChoice>,
  answer: QuizMultipleChoiceAnswer
) {
  const isCorrect = question.correctIndex === answer.answerIndex;

  return {
    questionId: answer.questionId,
    answerIndex: answer.answerIndex,
    correctIndex: question.correctIndex,
    isCorrect,
  };
}

function gradeMultipleChoiceQuestions(
  answers: {
    question: Selectable<QuizQuestionMultipleChoice>;
    answer: QuizMultipleChoiceAnswer;
  }[]
) {
  const stats = {
    totalCorrect: 0,
    totalIncorrect: 0,
  };
  const grades = [];

  for (const { question, answer } of answers) {
    const grading = assessMultipleChoiceAnswer(question, answer);
    if (grading.isCorrect) stats.totalCorrect++;
    else stats.totalIncorrect++;

    grades.push(grading);
  }

  return { stats, grades };
}

async function gradeFreeResponseQuestions(
  answers: {
    question: Selectable<QuizQuestionFreeResponse>;
    answer: QuizFreeResponseAnswer;
  }[]
) {
  const freeResponseGrading = await openaiRequest({
    payload: answers,
    generator: openaiRequestHandler.freeResponseQuestionGradingGenerator,
    errorMessage: 'Free responses could not be graded',
  });

  if (!freeResponseGrading)
    throw new Error('Free responses could not be graded');

  const stats = {
    totalCorrect: 0,
    totalIncorrect: 0,
  };

  const grades = [];

  for (const { questionId, isCorrect, feedbackText } of freeResponseGrading) {
    if (isCorrect) stats.totalCorrect++;
    else stats.totalIncorrect++;

    const answerText =
      answers.find(({ question }) => question.id === questionId)?.answer
        .answerText || 'N/A';
    grades.push({
      questionId,
      isCorrect,
      feedbackText,
      answerText,
    });
  }

  return { stats, grades };
}

export async function gradeQuestions(
  questionsAndAnswers: {
    question: IQuizQuestion;
    answer: IQuizSubmissionAnswer;
  }[]
) {
  const freeResponseQuestionsAndAnswers: FreeResponseQA[] = [];
  const multipleChoiceQuestionsAndAnswers: MultipleChoiceQA[] = [];
  // ts hack to get around type narrowing
  for (const { question, answer } of questionsAndAnswers) {
    if (
      question.type === 'multiple-choice' &&
      answer.type === 'multiple-choice'
    ) {
      multipleChoiceQuestionsAndAnswers.push({ question, answer });
    } else if (
      question.type === 'free-response' &&
      answer.type === 'free-response'
    ) {
      freeResponseQuestionsAndAnswers.push({ question, answer });
    }
  }

  const { multipleChoiceStats, multipleChoiceGrades } =
    gradeMultipleChoiceQuestions(multipleChoiceQuestionsAndAnswers);
  const { freeResponseStats, freeResponseGrades } =
    await gradeFreeResponseQuestions(freeResponseQuestionsAndAnswers);
  return {
    multipleChoiceStats,
    multipleChoiceGrades,
    freeResponseStats,
    freeResponseGrades,
  };
}

function linkQuestionWithAnswer<
  T extends { id: number },
  U extends { questionId: number }
>(questions: T[], answers: U[]): { question: T; answer: U }[] {
  const res = questions.map((question) => {
    const answer = answers.find((answer) => answer.questionId === question.id);
    if (!answer) {
      throw new Error('Answer not found for question');
    }

    return { question, answer };
  });
  return res;
}

export async function gradeAnswers({
  questions,
  answers,
}: {
  questions: {
    multipleChoice: Selectable<QuizQuestionMultipleChoice>[];
    freeResponse: Selectable<QuizQuestionFreeResponse>[];
  };
  answers: QuizAnswers;
}) {
  // link each question with its answer
  const multipleChoice = linkQuestionWithAnswer(
    questions.multipleChoice,
    answers.multipleChoice || []
  );

  const freeResponse = linkQuestionWithAnswer(
    questions.freeResponse,
    answers.freeResponse || []
  );

  // grade the questions
  const { stats: statsMC, grades: gradesMC } =
    gradeMultipleChoiceQuestions(multipleChoice);
  const { stats: statsFR, grades: gradeFR } = await gradeFreeResponseQuestions(
    freeResponse
  );
  return {
    multipleChoice: { stats: statsMC, grades: gradesMC },
    freeResponse: { stats: statsFR, grades: gradeFR },
    totalCorrect: statsMC.totalCorrect + statsFR.totalCorrect,
    totalIncorrect: statsMC.totalIncorrect + statsFR.totalIncorrect,
    totalQuestions:
      questions.multipleChoice.length + questions.freeResponse.length,
    totalUnanswered:
      questions.multipleChoice.length +
      questions.freeResponse.length -
      (answers.multipleChoice?.length || 0) -
      (answers.freeResponse?.length || 0),
    score:
      (statsMC.totalCorrect + statsFR.totalCorrect) /
      (statsMC.totalCorrect +
        statsFR.totalCorrect +
        statsMC.totalIncorrect +
        statsFR.totalIncorrect),
  };
}
