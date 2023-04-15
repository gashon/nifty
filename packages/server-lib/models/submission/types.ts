import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export type ISubmissionAnswer = ({
  question_id: string;
  type: "multiple-choice";
  answer_index: number;
  is_correct: boolean;
  correct_index: number;
}) |
  ({
    question_id: string;
    type: "free-response";
    answer_text: string;
    feedback_text: string;
    is_correct: boolean;
  })

export type IFreeResponseSubmissionAnswer = Extract<ISubmissionAnswer, { type: "free-response" }>
export type IMultipleChoiceSubmissionAnswer = Extract<ISubmissionAnswer, { type: "multiple-choice" }>


export type IQuizMultipleChoiceAnswer = Pick<
  IMultipleChoiceSubmissionAnswer,
  'question_id' | 'answer_index' | "type"
>
export type IQuizFreeResponseAnswer = Pick<
  IFreeResponseSubmissionAnswer,
  'question_id' | 'answer_text' | "type"
>
export type IQuizSubmissionAnswer = IQuizMultipleChoiceAnswer | IQuizFreeResponseAnswer

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