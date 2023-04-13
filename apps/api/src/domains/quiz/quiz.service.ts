import { injectable } from 'inversify';
import { Model, Query } from 'mongoose';

import Quiz, { QuizDocument } from "@nifty/server-lib/models/quiz";
import { IQuizService, IQuiz } from './interfaces';

@injectable()
export class QuizService implements IQuizService {
  private quizModel: Model<QuizDocument>;

  constructor() {
    this.quizModel = Quiz;
  }

  async findQuizById(id: string, hideAnswers: boolean = false): Promise<QuizDocument | null> {
    return this.quizModel.findById(id, {
      'questions.correct_index': hideAnswers ? 0 : 1,
    });
  }

  async findQuizzesByIds(ids: string[]): Promise<Query<(QuizDocument & Required<{ _id: string; }>)[], QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>> {
    return this.quizModel.find({
      _id: {
        $in: ids
      },
      deleted_at: null
    }).sort({ created_at: -1 });
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

  async deleteQuizById(id: string): Promise<Query<any, QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>> {
    return this.quizModel.updateOne(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    )
  }
}