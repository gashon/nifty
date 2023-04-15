import status from "http-status";
import { v4 as uuid } from 'uuid';
import logger from "@/lib/logger"
import {
  generateMultipleChoiceQuizFromNote,
  generateFreeResponseQuizFromNote,
  generateFreeResponseGrading,
  shuffleQuiz
} from "@/util"
import { CustomException } from "@/exceptions";
import { IFreeResponseQuizQuestion } from "@nifty/server-lib/models/quiz";
import { IFreeResponseSubmissionGradingResponse } from "@nifty/server-lib/models/submission";

type FormatFn = (data: any) => string;
type SendRequestFn = (data: any) => Promise<any>;
type ReformatFn<T> = (data: string) => T;

interface RequestItem<T> {
  format: FormatFn;
  sendRequest: SendRequestFn;
  reformat: ReformatFn<T>;
}

function formatNoteContent(noteContent: string): string {
  // convert note content to text and some markdown
  return JSON.parse(noteContent).reduce((acc: string[], curr: any) => {
    acc.push((curr.type.includes("heading") ? "# " : "") + curr.children[0].text)
    return acc
  }, []).join('\n')
}

export const openaiRequestHandler: {
  [key: string]: RequestItem<any>;
} = {
  multipleChoiceQuizGenerator: {
    format: formatNoteContent,
    sendRequest: generateMultipleChoiceQuizFromNote,
    reformat: (stringifiedQuiz: string) => {
      // randomize the order of the questions and mark the correct_index
      const quizContent = JSON.parse(stringifiedQuiz).questions
      const randomizedQuiz = shuffleQuiz(quizContent);
      return randomizedQuiz;
    }
  },
  freeResponseQuizGenerator: {
    format: formatNoteContent,
    sendRequest: generateFreeResponseQuizFromNote,
    reformat: (stringifiedQuiz: string): IFreeResponseQuizQuestion => {
      const questions = JSON.parse(stringifiedQuiz).questions
      return questions.map((question: string) => ({
        id: uuid(),
        type: "free-response",
        question: question,
      }))
    }
  },
  freeResponseQuestionGradingGenerator: {
    format: (questionsAndAnswers: any[]) => {
      return JSON.stringify({
        questions: questionsAndAnswers.map(({ question, answer }) => ({
          question_id: question.id,
          question: question.question,
          answer_text: answer.answer_text,
        }))
      })
    },
    sendRequest: generateFreeResponseGrading,
    reformat: (stringifiedGrades: string): IFreeResponseSubmissionGradingResponse[] => {
      const { grades } = JSON.parse(stringifiedGrades);
      return grades;
    }
  },
}

export async function openaiRequest<T, U>(
  { generator, payload, errorMessage }:
    { generator: RequestItem<U>, payload: T, errorMessage?: string }
): Promise<U> {
  try {
    const formattedPayload = generator.format(payload);
    const result = await generator.sendRequest(formattedPayload);
    const formattedResult = generator.reformat(result);
    return formattedResult;
  } catch (err) {
    logger.error(`Error generating req: ${JSON.stringify(err)}}`);
    throw new CustomException(errorMessage ?? 'Failed to generate openai request', status.BAD_REQUEST);
  }
}