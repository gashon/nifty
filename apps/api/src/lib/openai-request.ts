import status from 'http-status';
import { jsonrepair } from 'jsonrepair';
import logger from '@nifty/api/lib/logger';
import {
  sendOpenAIRequest,
  shuffleQuiz,
  countTokens,
  createMultipleChoiceQuizGenerationPrompt,
  createFreeResponseQuizGenerationPrompt,
  createFreeResponseGradingPrompt,
} from '@nifty/api/util';
import { CustomException } from '@nifty/api/exceptions';
import { QuizFreeResponseAnswer } from '../domains/quiz/dto';
import {
  FreeResponseQuestion,
  MultipleChoiceQuestion,
  QuizQuestionFreeResponse,
  Selectable,
} from '@nifty/common/types';

type FreeResponseSubmissionGradingResponse = {
  id: number | string;
  feedbackText: string;
  isCorrect: boolean;
};

type FreeResponseSubmissionResult = {
  questionId: number;
  feedbackText: string;
  isCorrect: boolean;
};

type FormatFn = (data: any) => string;
type SendRequestFn = (data: string) => string;
type ReformatFn<T> = (data: string) => T;

interface RequestItem<T> {
  format: FormatFn;
  getPrompt: SendRequestFn;
  reformat: ReformatFn<T>;
}

function formatNoteContent(noteContent: string): string {
  // convert note content to text and some markdown
  return JSON.parse(noteContent)
    .reduce((acc: string[], curr: any) => {
      acc.push(
        (curr.type.includes('heading') ? '# ' : '') + curr.children[0].text
      );
      return acc;
    }, [])
    .join('\n');
}

export const openaiRequestHandler: {
  multipleChoiceQuizGenerator: RequestItem<MultipleChoiceQuestion[]>;
  freeResponseQuizGenerator: RequestItem<FreeResponseQuestion[]>;
  freeResponseQuestionGradingGenerator: RequestItem<
    FreeResponseSubmissionResult[]
  >;
} = {
  multipleChoiceQuizGenerator: {
    format: formatNoteContent,
    getPrompt: createMultipleChoiceQuizGenerationPrompt,
    reformat: (stringifiedQuiz: string): MultipleChoiceQuestion[] => {
      const repairedJSON = jsonrepair(stringifiedQuiz);
      const quizContent = JSON.parse(repairedJSON).questions;

      // randomize the order of the questions and mark the correct_index
      const randomizedQuiz = shuffleQuiz(quizContent);
      return randomizedQuiz;
    },
  },
  freeResponseQuizGenerator: {
    format: formatNoteContent,
    getPrompt: createFreeResponseQuizGenerationPrompt,
    reformat: (stringifiedQuiz: string): FreeResponseQuestion[] => {
      const repairedJSON = jsonrepair(stringifiedQuiz);
      const questions = JSON.parse(repairedJSON).questions;

      return questions;
    },
  },
  freeResponseQuestionGradingGenerator: {
    format: (
      questionsAndAnswers: {
        question: Selectable<QuizQuestionFreeResponse>;
        answer: QuizFreeResponseAnswer;
      }[]
    ) => {
      return JSON.stringify({
        questions: questionsAndAnswers.map(({ question, answer }) => ({
          id: question.id, // map question_id to id to reduce token count https://platform.openai.com/tokenizer
          question: question.question,
          answerText: answer.answerText,
        })),
      });
    },
    getPrompt: createFreeResponseGradingPrompt,
    reformat: (
      stringifiedGrades: string
    ): {
      questionId: number;
      feedbackText: string;
      isCorrect: boolean;
    }[] => {
      const repairedJSON = jsonrepair(stringifiedGrades);
      const { grades } = JSON.parse(repairedJSON);
      return grades.map(
        ({
          id,
          feedbackText,
          isCorrect,
        }: FreeResponseSubmissionGradingResponse) => ({
          questionId: Number(id),
          feedbackText,
          isCorrect,
        })
      );
    },
  },
};

export async function openaiRequest<T>(generatorItem: {
  generator: RequestItem<T>;
  payload: any;
  errorMessage?: string;
  disabled?: boolean;
}): Promise<T | undefined> {
  if (generatorItem.disabled) {
    return undefined;
  }

  const {
    generator: { format, getPrompt, reformat },
    payload,
    errorMessage,
  } = generatorItem;

  try {
    const formattedPayload = format(payload);
    logger.info(`Sending openai request with payload: ${formattedPayload}}`);

    const prompt = getPrompt(formattedPayload);

    logger.info(`Sending openai request with prompt: ${prompt}}`);
    const result = await sendOpenAIRequest(prompt);

    logger.info(`Received openai response: ${result}}`);
    const formattedResult: ReturnType<typeof reformat> = reformat(result!);
    return formattedResult;
  } catch (err) {
    logger.error(
      `Error sending or parsing openai request: ${JSON.stringify(err)}}`
    );
    throw new CustomException(
      errorMessage ?? 'Failed to generate openai request',
      status.BAD_REQUEST
    );
  }
}
