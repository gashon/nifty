import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IQuiz extends Resource {
  created_by: string;
  collaborators: string[];
  note: string;
  title: string;
  is_public: boolean;
}

export type QuizDocument = mongoose.Document<string, object, IQuiz> & IQuiz;

export type QuizCreateRequest = Partial<Expand<Pick<IQuiz, 'note'>>>
export type QuizUpdateRequest = Partial<Expand<Omit<IQuiz, 'created_by'>>>

export type QuizListResponse = ListResponse<QuizDocument>