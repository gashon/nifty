import type { Request, Response } from 'express';
import type { QuizCreateResponse } from '@/domains/quiz/types';

interface IQuizController {
  getQuiz(req: Request, res: Response): Promise<void>;
  createQuiz(
    req: Request,
    res: Response
  ): Promise<Response<QuizCreateResponse>>;
  getQuizzes(req: Request, res: Response): Promise<void>;
}
export type { IQuizController };
