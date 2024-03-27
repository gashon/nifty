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

  async createDirectoryAndCollaborator({
    userId,
    values,
    collabortorPermissions,
  }: {
    userId: number;
    values: Insertable<Directory>;
    collabortorPermissions: number;
  }) {
    return this.db.transaction().execute(async (trx) => {
      // create directory and collaborators together
      const [directory, collaborator] = await Promise.all([
        await trx
          .insertInto('directory')
          .values(values)
          .returningAll()
          .executeTakeFirstOrThrow(),
        trx
          .insertInto('collaborator')
          .values({
            userId,
            createdBy: userId,
            permissions: collabortorPermissions,
          })
          .returningAll()
          .executeTakeFirstOrThrow(),
      ]);

      return { directory, collaborator };
    });
  }

  async getDirectoryById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'directory'>[] | "*";
  }) {
    const query = this.db
      .selectFrom('directory')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)

    if (select !== '*') return query.select(select).executeTakeFirstOrThrow();
    return query.executeTakeFirstOrThrow();
  }

  async deleteDirectoryById(id: number) {
    return this.db
      .updateTable('directory')
      .set({ deletedAt: new Date() })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }
}
