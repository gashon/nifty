import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  QuizCollaborator,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { OrderBy } from '@nifty/api/types';

@injectable()
export class QuizCollaboratorRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createQuizCollaborator({
    values,
    returning,
  }: {
    values: Insertable<QuizCollaborator>;
    returning: readonly SelectExpression<DB, 'quizCollaborator'>[];
  }) {
    return this.db
      .insertInto('quizCollaborator')
      .values(values)
      .returning(returning)
      .executeTakeFirst();
  }

  getQuizCollaboratorByQuizIdAndUserId({
    quizId,
    userId,
    select,
  }: {
    quizId: number;
    userId: number;
    select: readonly SelectExpression<
      DB,
      'quizCollaborator' | 'quiz' | 'collaborator'
    >[];
  }) {
    return (
      this.db
        .selectFrom('quizCollaborator')
        .where('quizId', '=', quizId)
        .innerJoin(
          'collaborator',
          'collaborator.id',
          'quizCollaborator.collaboratorId'
        )
        // sql will optimize this join out if unused in select
        .innerJoin('quiz', 'quiz.id', 'quizCollaborator.quizId')
        .where('userId', '=', userId)
        .select(select)
        .executeTakeFirst()
    );
  }

  async getQuizCollaboratorsByQuizId({
    quizId,
    select,
  }: {
    quizId: number;
    select: readonly SelectExpression<DB, 'quizCollaborator'>[];
  }) {
    return this.db
      .selectFrom('quizCollaborator')
      .where('quizCollaborator.quizId', '=', quizId)
      .innerJoin('quiz', 'quiz.id', 'quizCollaborator.quizId')
      .where('quiz.deletedAt', 'is', null)
      .select(select)
      .execute();
  }

  async paginateQuizsByUserId({
    userId,
    select,
    limit,
    cursor,
    orderBy,
  }: {
    userId: number;
    select: readonly SelectExpression<DB, 'quiz'>[] | '*';
    limit: number;
    cursor?: Date;
    orderBy: OrderBy<'quiz'>;
  }) {
    let query = this.db
      .selectFrom('quizCollaborator')
      .innerJoin('quiz', 'quiz.id', 'quizCollaborator.quizId')
      .where('quizCollaborator.userId', '=', userId)
      .where('quiz.deletedAt', 'is', null);

    if (cursor) {
      query = query.where('quiz.createdAt', '<', cursor);
    }

    if (select !== '*')
      return query.select(select).orderBy(orderBy).limit(limit).execute();

    return query.selectAll().orderBy(orderBy).limit(limit).execute();
  }
}
