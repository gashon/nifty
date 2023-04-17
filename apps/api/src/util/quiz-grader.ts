import { IQuizQuestion, IFreeResponseQuizQuestion, IQuizMultipleChoiceQuestion, IQuizFreeResponseQuestion } from '@nifty/server-lib/models/quiz';
import { IQuizSubmissionAnswer, IFreeResponseSubmissionGradingResponse, IQuizMultipleChoiceAnswer, IQuizFreeResponseAnswer, IMultipleChoiceSubmissionAnswer, IFreeResponseSubmissionAnswer, } from '@nifty/server-lib/models/submission';
import { openaiRequest, openaiRequestHandler } from "@/lib/openai-request";

type MultipleChoiceQA = {
  question: IQuizMultipleChoiceQuestion;
  answer: IQuizMultipleChoiceAnswer;
}

export type FreeResponseQA = {
  question: IQuizFreeResponseQuestion;
  answer: IQuizFreeResponseAnswer;
}

export function handleMultipleChoice(
  question: IQuizMultipleChoiceQuestion,
  answer: IQuizMultipleChoiceAnswer,
) {
  const isCorrect = question.correct_index === answer.answer_index;

  return {
    question_id: answer.question_id,
    type: question.type,
    answer_index: answer.answer_index,
    correct_index: question.correct_index,
    is_correct: isCorrect,
  };
}

function gradeMultipleChoiceQuestions(multipleChoiceQuestionsAndAnswers: MultipleChoiceQA[]) {
  const multipleChoiceStats = { total_correct: 0, total_incorrect: 0 };
  const multipleChoiceGrades = multipleChoiceQuestionsAndAnswers.map(({ question, answer }) => {
    const grading = handleMultipleChoice(question, answer);
    if (grading.is_correct) {
      multipleChoiceStats.total_correct++;
    }
    else {
      multipleChoiceStats.total_incorrect++;
    }
    return grading;
  }
  );

  return {
    multipleChoiceStats,
    multipleChoiceGrades
  }
}

async function gradeFreeResponseQuestions(freeResponseQuestionsAndAnswers: FreeResponseQA[]) {
  const freeResponseGrading = await openaiRequest({
    payload: freeResponseQuestionsAndAnswers,
    generator: openaiRequestHandler.freeResponseQuestionGradingGenerator,
    errorMessage: "Free responses could not be graded"
  });

  return {
    freeResponseStats: {
      total_correct: freeResponseGrading.filter(({ is_correct }) => is_correct).length,
      total_incorrect: freeResponseGrading.filter(({ is_correct }) => !is_correct).length,
    },
    freeResponseGrades: freeResponseGrading.map((grade) => {
      const { question_id, is_correct, feedback_text } = grade;
      return {
        type: "free-response",
        answer_text: freeResponseQuestionsAndAnswers.find(({ question }) => question.id === question_id)?.answer.answer_text || "No Answer",
        question_id,
        is_correct,
        feedback_text,
      } as IFreeResponseSubmissionAnswer
    })
  }
}

export async function gradeQuestions(questionsAndAnswers:
  {
    question: IQuizQuestion,
    answer: IQuizSubmissionAnswer
  }[]) {

  const freeResponseQuestionsAndAnswers: FreeResponseQA[] = [];
  const multipleChoiceQuestionsAndAnswers: MultipleChoiceQA[] = [];
  // ts hack to get around type narrowing
  for (const { question, answer } of questionsAndAnswers) {
    if (question.type === "multiple-choice" && answer.type === "multiple-choice") {
      multipleChoiceQuestionsAndAnswers.push({ question, answer });
    } else if (question.type === "free-response" && answer.type === "free-response") {
      freeResponseQuestionsAndAnswers.push({ question, answer });
    }
  }

  const { multipleChoiceStats, multipleChoiceGrades } = gradeMultipleChoiceQuestions(multipleChoiceQuestionsAndAnswers);
  const { freeResponseStats, freeResponseGrades } = await gradeFreeResponseQuestions(freeResponseQuestionsAndAnswers);
  return {
    multipleChoiceStats,
    multipleChoiceGrades,
    freeResponseStats,
    freeResponseGrades
  }
}
