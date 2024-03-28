import { injectable, inject } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  Quiz,
  DB,
  Updateable,
  FreeResponseQuestion,
  MultipleChoiceQuestion,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { QuizRepository } from '@nifty/api/domains';
import { Permission } from '@nifty/api/util';

@injectable()
export class QuizService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private quizRepository: QuizRepository
  ) {}

  async deleteQuizById(id: number) {
    return this.quizRepository.deleteQuizById(id);
  }

  async getQuizById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'quiz'>[] | '*';
  }) {
    return this.quizRepository.getQuizById({
      id,
      select,
    });
  }

  async getQuizQuestionsById(quizId: number) {
    const [multipleChoiceQuestions, freeResponseQuestions] = await Promise.all([
      this.quizRepository.getMultipleChoiceQuestionsByQuizId(quizId),
      this.quizRepository.getFreeResponseQuestionsByQuizId(quizId),
    ]);

    return {
      multipleChoiceQuestions,
      freeResponseQuestions,
    };
  }

  async createQuizAndCollaborator({
    userId,
    values,
    questions,
    collabortorPermissions,
  }: {
    userId: number;
    noteId: number;
    values: Insertable<Quiz>;
    questions: {
      freeResponse: FreeResponseQuestion[];
      multipleChoice: MultipleChoiceQuestion[];
    };
    collabortorPermissions: Permission;
  }) {
    return this.quizRepository.createQuizAndCollaborator({
      userId,
      values,
      questions,
      collabortorPermissions,
    });
  }
}
