import { IQuiz } from './interfaces';

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

