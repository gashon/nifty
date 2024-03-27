import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  User,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';

@injectable()
export class UserRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createUser({
    values,
    returning,
  }: {
    values: Insertable<User>;
    returning: readonly SelectExpression<DB, 'user'>[] | '*';
  }) {
    const query = this.db.insertInto('user').values(values);

    if (returning !== '*')
      return query.returning(returning).executeTakeFirstOrThrow();

    return query.returningAll().executeTakeFirstOrThrow();
  }

  async getUserById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'user'>[] | '*';
  }) {
    const query = this.db
      .selectFrom('user')
      .where('id', '=', id)
      .where('deletedAt', 'is', null);

    if (select !== '*') return query.select(select).executeTakeFirstOrThrow();
    return query.executeTakeFirstOrThrow();
  }

  async deleteUserById(id: number) {
    return this.db
      .updateTable('user')
      .set({ deletedAt: new Date() })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }
}
