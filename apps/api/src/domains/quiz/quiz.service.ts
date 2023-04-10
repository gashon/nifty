import { inject, injectable } from 'inversify';
import { FilterQuery, Model, Query } from 'mongoose';

import Quiz, { QuizDocument, QuizListResponse } from "@nifty/server-lib/models/quiz";
import Directory, { DirectoryDocument } from "@nifty/server-lib/models/directory";
import { IQuizService, IQuiz } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class QuizService implements IQuizService {
  private quizModel: Model<QuizDocument>;
  private directoryModel: Model<DirectoryDocument>;

  constructor() {
    this.quizModel = Quiz;
    this.directoryModel = Directory;
  }

  async findQuizById(id: string): Promise<QuizDocument | null> {
    return this.quizModel.findById(id);
  }

  async findQuizzesByIds(ids: string[]): Promise<Query<(QuizDocument & Required<{ _id: string; }>)[], QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>> {
    return this.quizModel.find({
      _id: {
        $in: ids
      },
      deleted_at: null
    }).sort({ created_at: -1 });
  }

  async updateQuizById(id: string, data: Partial<IQuiz>): Promise<Query<any, QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>> {
    return this.quizModel.updateOne({
      _id: id
    }, {
      $set: data
    }, {})
  }

  async paginateQuizzes(condition: FilterQuery<QuizDocument>, query: PaginationParams): Promise<Partial<QuizListResponse>> {
    return this.quizModel.paginate({
      ...condition,
      ...query
    });
  }

  async paginateQuizzesByCollaboratorId(collaboratorId: string, query: PaginationParams): Promise<Partial<QuizListResponse>> {
    return this.quizModel.paginate({
      collaborators: {
        $elemMatch: {
          $eq: collaboratorId
        }
      },
      ...query
    },);
  }

  async paginateQuizzesByDirectoryId(directoryId: string, query: PaginationParams): Promise<Partial<QuizListResponse>> {
    const directory = await this.directoryModel.findById(directoryId);
    if (!directory) return { data: [], total: 0, page: 0, has_more: false };

    return this.quizModel.paginate({
      _id: {
        $in: directory.quizzes
      },
      ...query
    });
  }

  async createQuiz(createdBy: string, data: Partial<IQuiz>): Promise<QuizDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
      parent: null,
    }
    const quiz = await this.quizModel.create(doc);
    return quiz;
  }

  async findOrCreate(key: Partial<IQuiz>, data: Partial<IQuiz>): Promise<[QuizDocument, boolean]> {
    const quiz = await this.quizModel.findOne(key);
    if (quiz) return [quiz, false];

    return [await this.quizModel.create(data), true];
  }

  async deleteQuizById(id: string): Promise<Query<any, QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>> {
    return this.quizModel.updateOne(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    )
  }

  async findQuizNeighbors(quizId: string, directoryId: string, sortBy: keyof QuizDocument, limit: number): Promise<{ before: QuizDocument[], after: QuizDocument[] }> {

    const quiz = await this.findQuizById(quizId);
    if (!quiz) return { before: [], after: [] };

    const query = {
      _id: {
        $ne: quizId
      },
      directory_id: directoryId,
      deleted_at: null
    }

    const [before, after] = await Promise.all([
      this.quizModel.find({ ...query, [sortBy]: { $lt: quiz[sortBy] } })
        .sort({ [sortBy]: -1 })
        .limit(limit),
      this.quizModel.find({ ...query, [sortBy]: { $gt: quiz[sortBy] } })
        .sort({ [sortBy]: 1 })
        .limit(limit)
    ])

    return {
      before,
      after
    }
  }
}