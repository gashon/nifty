import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export type IQuizMultipleChoiceQuestion = {
  id: string;
  question: string;
  type: "multiple-choice"
  answers: string[];
  correct_index: number;
}
export type IQuizFreeResponseQuestion = {
  id: string;
  question: string;
  type: "free-response"
}
export type IQuizQuestion = IQuizMultipleChoiceQuestion | IQuizFreeResponseQuestion

export type IMultipleChoiceQuizQuestion = Extract<IQuizQuestion, { type: "multiple-choice" }>
export type IFreeResponseQuizQuestion = Extract<IQuizQuestion, { type: "free-response" }>
export interface IQuiz extends Resource {
  created_by: string;
  collaborators: string[];
  note: string;
  title: string;
  questions: IQuizQuestion[];
}

export type QuizDocument = mongoose.Document<string, object, IQuiz> & IQuiz;

export type QuizCreateRequest = Pick<IQuiz, 'title' | 'note'> & {
  question_type: {
    multiple_choice: boolean;
    free_response: boolean;
  }
}
export type QuizUpdateRequest = Partial<Expand<Omit<IQuiz, 'created_by'>>>

export type QuizListResponse = ListResponse<QuizDocument>