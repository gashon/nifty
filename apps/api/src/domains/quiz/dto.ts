import type {
  AppPaginationResponse,
  AppResponse,
} from '@nifty/api/domains/dto';
import { PaginationQueryParams } from '@nifty/api/types';
import type {
  Insertable,
  Quiz,
  Submission,
  SubmissionAnswerMultipleChoice,
  SubmissionAnswerFreeResponse,
  Selectable,
} from '@nifty/common/types';

export type GetQuizByIdResponse = AppResponse<Selectable<Quiz>>;
export type GetQuizByIdRequestParams = number;

export type GetQuizzesResponse = AppPaginationResponse<Selectable<Quiz>>;
export type GetQuizzesRequestQuery = PaginationQueryParams<'quiz'>;

export type CreateQuizResponse = AppResponse<Selectable<Quiz>>;
export type CreateQuizRequestBody = Omit<
  Insertable<Selectable<Quiz>>,
  'createdBy'
>;

export type UpdateQuizByIdResponse = AppResponse<Selectable<Quiz>>;
export type UpdateQuizByIdRequestParams = number;

export type DeleteQuizByIdResponse = AppResponse<Selectable<Quiz>>;
export type DeleteQuizByIdRequestParams = number;

export type CreateRemixQuizResponse = AppResponse<Selectable<Quiz>>;
export type CreateRemixQuizRequestParams = number;

export type QuizFreeResponseAnswer = Pick<
  Selectable<SubmissionAnswerFreeResponse>,
  'questionId' | 'answerText'
>;
export type QuizMultipleChoiceAnswer = Pick<
  Selectable<SubmissionAnswerMultipleChoice>,
  'questionId' | 'answerIndex'
>;
export type QuizAnswers = {
  multipleChoice?: QuizMultipleChoiceAnswer[];
  freeResponse?: QuizFreeResponseAnswer[];
};
export type CreateQuizSubmissionResponse = AppResponse<Submission>;
export type CreateQuizSubmissionRequestBody = Omit<
  Insertable<Submission>,
  | 'createdBy'
  | 'score'
  | 'totalCorrect'
  | 'totalIncorrect'
  | 'totalQuestions'
  | 'totalUnanswered'
> & {
  answers: QuizAnswers;
};
export type CreateQuizSubmissionRequestParams = number;

export type GetQuizSubmissionByIdResponse = AppResponse<Submission>;
export type GetQuizSubmissionByIdRequestParams = number;

export type GetQuizSubmissionsResponse = AppResponse<Submission[]>;
export type GetQuizSubmissionsRequestParams = number;
export type GetQuizSubmissionsRequestQuery =
  PaginationQueryParams<'submission'>;
