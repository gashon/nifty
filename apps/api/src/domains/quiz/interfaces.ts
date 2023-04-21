import { Request, Response } from 'express';
import { Query } from 'mongoose';

import { ISubmission, SubmissionDocument } from "@nifty/server-lib/models/submission";
import { IQuiz, QuizDocument, } from "@nifty/server-lib/models/quiz";
import { QuizCreateResponse } from "@/domains/quiz/types";
import Resource from "@nifty/server-lib/utils/types/resource";

interface IQuizController {
  getQuiz(req: Request, res: Response): Promise<void>;
  createQuiz(req: Request, res: Response): Promise<Response<QuizCreateResponse>>
  getQuizzes(req: Request, res: Response): Promise<void>;
}

interface IQuizService {
  findQuizById(id: string, hideAnswers?: boolean): Promise<QuizDocument | null>;
  createQuiz(createdBy: string, data: Omit<IQuiz, "created_by" | keyof Resource>): Promise<QuizDocument>;
  findQuizzesByIds(ids: string[]): Promise<Query<(QuizDocument & Required<{ _id: string; }>)[], QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>>
  deleteQuizById(id: string): Promise<Query<any, QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>>;
  submitQuiz(createdBy: string, submissionAttributes: Omit<ISubmission, keyof Resource | "created_by">): Promise<SubmissionDocument>;
  findSubmissionById(id: string): Promise<SubmissionDocument | null>;
  findQuizByNoteId(id: string, hideAnswers?: boolean): Promise<QuizDocument | null>
}

export { IQuiz, IQuizController, IQuizService }; 