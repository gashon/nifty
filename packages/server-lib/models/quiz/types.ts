import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IQuizQuestion {
  question: string;
  answers: string[];
  correct_index: number;
}

export interface IQuiz extends Resource {
  created_by: string;
  collaborators: string[];
  note: string;
  title: string;
  is_public: boolean;
  questions: IQuizQuestion[];
}

export type QuizDocument = mongoose.Document<string, object, IQuiz> & IQuiz;

export type QuizCreateRequest = Partial<Expand<Pick<IQuiz, 'title' | 'note'>>>
export type QuizUpdateRequest = Partial<Expand<Omit<IQuiz, 'created_by'>>>

export type QuizListResponse = ListResponse<QuizDocument>