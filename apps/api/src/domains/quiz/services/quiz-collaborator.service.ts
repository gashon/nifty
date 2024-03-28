import { inject, injectable } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  QuizCollaborator,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { QuizCollaboratorRepository } from '@nifty/api/domains';
import { Permission, isPermitted } from '@nifty/api/util';

@injectable()
export class QuizCollaboratorService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private quizCollaboratorRepository: QuizCollaboratorRepository
  ) {}

  async createQuizCollaborator({
    values,
    returning,
  }: {
    values: Insertable<QuizCollaborator>;
    returning: readonly SelectExpression<DB, 'quizCollaborator'>[];
  }) {
    return this.quizCollaboratorRepository.createQuizCollaborator({
      values,
      returning,
    });
  }

  async userHasPermissionToQuiz({
    quizId,
    userId,
    permission,
  }: {
    quizId: number;
    userId: number;
    permission: Permission;
  }) {
    const res =
      await this.quizCollaboratorRepository.getQuizCollaboratorByQuizIdAndUserId(
        {
          quizId,
          userId,
          select: ['collaborator.permissions'],
        }
      );

    if (!res) {
      return false;
    }

    const hasCollaboratorPermission = isPermitted(
      res.collaborator.permissions,
      permission
    );

    return hasCollaboratorPermission;
  }

  async paginateQuizzesByUserId({
    userId,
    select,
    limit,
    cursor,
  }: {
    userId: number;
    select: readonly SelectExpression<DB, 'quiz'>[] | '*';
    limit: number;
    cursor?: Date;
  }) {
    return this.quizCollaboratorRepository.paginateQuizsByUserId({
      userId,
      select,
      limit,
      cursor,
    });
  }
}
