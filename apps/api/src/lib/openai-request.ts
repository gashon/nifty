import status from "http-status";
import logger from "@/lib/logger"
import {
  sendOpenAIRequest,
  shuffleQuiz,
  countTokens,
  createMultipleChoiceQuizGenerationPrompt,
  createFreeResponseQuizGenerationPrompt,
  createFreeResponseGradingPrompt
} from "@/util"
import { CustomException } from "@/exceptions";
import { IFreeResponseQuizQuestion, IMultipleChoiceQuizQuestion } from "@nifty/server-lib/models/quiz";
import { IFreeResponseSubmissionGradingResponse } from "@nifty/server-lib/models/submission";

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
  return JSON.parse(noteContent).reduce((acc: string[], curr: any) => {
    acc.push((curr.type.includes("heading") ? "# " : "") + curr.children[0].text)
    return acc
  }, []).join('\n')
}

export const openaiRequestHandler: {
  multipleChoiceQuizGenerator: RequestItem<IMultipleChoiceQuizQuestion[]>;
  freeResponseQuizGenerator: RequestItem<IFreeResponseQuizQuestion[]>;
  freeResponseQuestionGradingGenerator: RequestItem<IFreeResponseSubmissionGradingResponse[]>;
} = {
  multipleChoiceQuizGenerator: {
    format: formatNoteContent,
    getPrompt: createFreeResponseGradingPrompt,
    reformat: (stringifiedQuiz: string): IMultipleChoiceQuizQuestion[] => {
      // randomize the order of the questions and mark the correct_index
      const quizContent = JSON.parse(stringifiedQuiz).questions
      const randomizedQuiz = shuffleQuiz(quizContent);
      return randomizedQuiz;
    }
  },
  freeResponseQuizGenerator: {
    format: formatNoteContent,
    getPrompt: createFreeResponseGradingPrompt,
    reformat: (stringifiedQuiz: string): IFreeResponseQuizQuestion[] => {
      const questions = JSON.parse(stringifiedQuiz).questions
      return questions.map((question: string, index: number) => ({
        id: (index + 50).toString(), // 50 is a random pad to avoid collisions with multiple choice questions, we use serial ids to reduce token count https://platform.openai.com/tokenizer
        type: "free-response",
        question: question,
      }))
    }
  },
  freeResponseQuestionGradingGenerator: {
    format: (questionsAndAnswers: any[]) => {
      return JSON.stringify({
        questions: questionsAndAnswers.map(({ question, answer }) => ({
          id: question.id, // map question_id to id to reduce token count https://platform.openai.com/tokenizer
          question: question.question,
          answer_text: answer.answer_text, // todo consider mapping to "answer"
        }))
      })
    },
    getPrompt: createFreeResponseGradingPrompt,
    reformat: (stringifiedGrades: string): IFreeResponseSubmissionGradingResponse[] => {
      const { grades } = JSON.parse(stringifiedGrades);
      return grades.map(({ id, feedback_text, is_correct }: { id: number | string, feedback_text: string, is_correct: boolean }) => ({
        question_id: id.toString(),
        feedback_text,
        is_correct,
      }))
    }
  },
}

export async function openaiRequest<T>(generatorItem: {
  generator: RequestItem<T>;
  payload: any;
  errorMessage?: string;
}): Promise<T> {
  const { generator: { format, getPrompt, reformat }, payload, errorMessage } = generatorItem;

  try {
    const formattedPayload = format(payload);
    logger.info(`Sending openai request: ${JSON.stringify(formattedPayload)}`)

    const prompt = getPrompt(formattedPayload);
    const result = await sendOpenAIRequest(prompt);
    logger.info(`Successfully sent openai request: ${JSON.stringify(result)}`);

    const formattedResult: ReturnType<typeof reformat> = reformat(result!);
    return formattedResult;
  } catch (err) {
    logger.error(`Error sending or parsing openai request: ${JSON.stringify(err)}}`);
    throw new CustomException(errorMessage ?? 'Failed to generate openai request', status.BAD_REQUEST);
  }
}
