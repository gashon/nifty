import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  Directory,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';

@injectable()
export class DirectoryRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createDirectory({
    values,
    returning,
  }: {
    values: Insertable<Directory>;
    returning: readonly SelectExpression<DB, 'directory'>[] | '*';
  }) {
    const query = this.db.insertInto('directory').values(values);

    if (returning !== '*')
      return query.returning(returning).executeTakeFirstOrThrow();

    return query.returningAll().executeTakeFirstOrThrow();
  }

  async getDirectoryById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'directory'>[];
  }) {
    return this.db
      .selectFrom('directory')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .select(select)
      .executeTakeFirst();
  }
}
