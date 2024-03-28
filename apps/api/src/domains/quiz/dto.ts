import type {
  AppPaginationResponse,
  AppResponse,
} from '@nifty/api/domains/dto';
import { PaginationParams } from '@nifty/api/types';
import type {
  Insertable,
  Note,
  Updateable,
  Directory,
  Quiz,
  Submission,
  SubmissionAnswerMultipleChoice,
  SubmissionAnswerFreeResponse,
  Selectable,
} from '@nifty/common/types';

export type GetQuizByIdResponse = AppResponse<Quiz>;
export type GetQuizByIdRequestParams = number;

export type GetQuizzesResponse = AppPaginationResponse<Quiz>;
export type GetQuizzesRequestQuery = PaginationParams<'quiz'>;

export type CreateQuizResponse = AppResponse<Quiz>;
export type CreateQuizRequestBody = Omit<Insertable<Quiz>, 'createdBy'>;

export type UpdateQuizByIdResponse = AppResponse<Quiz>;
export type UpdateQuizByIdRequestParams = number;

export type DeleteQuizByIdResponse = AppResponse<Quiz>;
export type DeleteQuizByIdRequestParams = number;

export type CreateRemixQuizResponse = AppResponse<Quiz>;
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
  | 'quizId'
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
export type GetQuizSubmissionsRequestParams = PaginationParams;
export type GetQuizSubmissionsRequestQuery = PaginationParams;
