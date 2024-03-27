import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  Collaborator,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';

@injectable()
export class CollaboratorRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createCollaborator({
    values,
    returning,
  }: {
    values: Insertable<Collaborator>;
    returning: readonly SelectExpression<DB, 'collaborator'>[];
  }) {
    return this.db
      .insertInto('collaborator')
      .values(values)
      .returning(returning)
      .executeTakeFirst();
  }

  async getCollaboratorByUserId({
    userId,
    select,
  }: {
    userId: number;
    select: readonly SelectExpression<DB, 'collaborator'>[];
  }) {
    return this.db
      .selectFrom('collaborator')
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .select(select)
      .executeTakeFirst();
  }
}
