import { injectable } from 'inversify';
import { Model, Query } from 'mongoose';

import Quiz, { QuizDocument } from "@nifty/server-lib/models/quiz";
import Submission, { SubmissionDocument, ISubmissionAnswer, ISubmission } from "@nifty/server-lib/models/submission";
import { IQuizService, IQuiz } from './interfaces';
import Resource from "@nifty/server-lib/utils/types/resource";
@injectable()
export class QuizService implements IQuizService {
  private quizModel: Model<QuizDocument>;
  private submissionModel: Model<SubmissionDocument>;

  constructor() {
    this.quizModel = Quiz;
    this.submissionModel = Submission;
  }

  async findQuizById(id: string, hideAnswers: boolean = false): Promise<QuizDocument | null> {
    if (hideAnswers) {
      return this.quizModel.findById(id, {
        'questions.correct_index': 0,
      });
    }
    return this.quizModel.findById(id);
  }

  async findQuizByNoteId(id: string, hideAnswers: boolean = false): Promise<QuizDocument | null> {
    if (hideAnswers) {
      return this.quizModel.findOne({
        note: id,
        deleted_at: null
      }, {
        'questions.correct_index': 0,
      });
    }
    return this.quizModel.findOne({ note: id, deleted_at: null });
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

  async submitQuiz(createdBy: string, submissionAttributes: Omit<ISubmission, keyof Resource | "created_by">): Promise<SubmissionDocument> {
    return this.submissionModel.create({
      ...submissionAttributes,
      created_by: createdBy,
    });
  }

  async findSubmissionById(id: string): Promise<SubmissionDocument | null> {
    return this.submissionModel.findById(id);
  }

  async findQuestionsByIds(ids: string[]): Promise<Query<(QuizDocument & Required<{ _id: string; }>)[], QuizDocument & Required<{ _id: string; }>, {}, QuizDocument>> {
    return this.quizModel.find({
      _id: {
        $in: ids
      },
      deleted_at: null
    }).sort({ created_at: -1 });
  }
}