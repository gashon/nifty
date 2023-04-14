import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface ISubmissionAnswer {
  question_id: string;
  type: "multiple-choice";
  correct_index: number;
  answer_index: number;
  is_correct: boolean;
}

export type IQuizSubmissionAnswer = Pick<
  ISubmissionAnswer,
  'question_id' | 'type' | 'answer_index'
>;

export interface ISubmission extends Resource {
  created_by: string;
  quiz: string;
  answers: ISubmissionAnswer[],
  total_questions: number,
  total_correct: number,
  total_incorrect: number,
  total_unanswered: number,
  score: number,
  time_taken: number,
}

export type SubmissionDocument = mongoose.Document<string, object, ISubmission> & ISubmission;

export type SubmissionCreateRequest = Pick<ISubmission, "time_taken"> & { answers: IQuizSubmissionAnswer[] } & { "quiz_id": string }
export type SubmissionUpdateRequest = Partial<Expand<Omit<ISubmission, 'created_by'>>>

export type SubmissionListResponse = ListResponse<SubmissionDocument>