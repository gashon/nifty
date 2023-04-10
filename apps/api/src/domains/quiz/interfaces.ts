import { Request, Response } from 'express';
import { FilterQuery, Query } from 'mongoose';

import { IQuiz, QuizDocument, QuizListResponse } from "@nifty/server-lib/models/quiz";
import { QuizCreateResponse } from "@/domains/quiz/types";
import { PaginationParams } from "@/types";

interface IQuizController {
  getQuiz(req: Request, res: Response): Promise<void>;
  createQuiz(req: Request, res: Response): Promise<Response<QuizCreateResponse>>
  getQuizzes(req: Request, res: Response): Promise<void>;
}

interface IQuizService {
  findQuizById(id: string): Promise<QuizDocument | null>;
  createQuiz(createdBy: string, data: Partial<IQuiz>): Promise<QuizDocument>;
  paginateQuizzes(condition: FilterQuery<QuizDocument>, query: PaginationParams): Promise<Partial<QuizListResponse>>;
  findQuizzesByIds(ids: string[]): Promise<Query<(QuizDocument & Required<{ _id: string; }>)[], QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>>
  updateQuizById(id: string, data: Partial<IQuiz>): Promise<Query<any, QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>>
  deleteQuizById(id: string): Promise<Query<any, QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>>;
  paginateQuizzesByCollaboratorId(collaboratorId: string, query: PaginationParams): Promise<Partial<QuizListResponse>>
}

export { IQuiz, IQuizController, IQuizService }; 