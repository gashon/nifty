import { Kysely, Selectable } from 'kysely';
import {
  DB as DBType,
  QuizQuestionFreeResponse,
  QuizQuestionMultipleChoice,
  SubmissionAnswerFreeResponse,
  SubmissionAnswerMultipleChoice,
} from './generated.types';

export type FreeResponseAnswerSubmission = Pick<
  Selectable<SubmissionAnswerFreeResponse>,
  'answerText' | 'feedbackText' | 'questionId'
>;

export type MultipleChoiceAnswerSubmission = Pick<
  Selectable<SubmissionAnswerMultipleChoice>,
  'answerIndex' | 'correctIndex' | 'isCorrect' | 'questionId'
>;

export type FreeResponseQuestion =
  typeof Selectable<QuizQuestionFreeResponse>['question'];

export type MultipleChoiceQuestion = Pick<
  Selectable<QuizQuestionMultipleChoice>,
  'question' | 'answers' | 'correctIndex' | 'id'
>;

export type {
  Insertable,
  InsertResult,
  Selectable,
  Updateable,
  SelectExpression,
  Transaction,
  SelectQueryBuilder,
} from 'kysely';
export type KysleyDB = Kysely<DBType>;
export * from './generated.types';
