import type { IQuiz } from '@nifty/server-lib/models/quiz';

export enum QUIZ_TYPES {
  SERVICE = 'QuizService',
  MODEL = 'QuizModel',
  CONTROLLER = 'QuizController',
}

export type QuizCreateResponse = {
  data: IQuiz;
};
export type QuizUpdateResponse = {
  data: IQuiz;
};
