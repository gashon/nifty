import { inject, injectable } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  Note,
  Updateable,
  Transaction,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { Permission } from '@nifty/api/util';
import { OrderBy } from '@nifty/api/types';

@injectable()
export class NoteRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createNote({
    values,
    returning,
  }: {
    values: Insertable<Note>;
    returning: readonly SelectExpression<DB, 'note'>[] | '*';
  }) {
    const query = this.db.insertInto('note').values(values);

    if (returning !== '*')
      return query.returning(returning).executeTakeFirstOrThrow();

    return query.returningAll().executeTakeFirstOrThrow();
  }

  async createNoteAndCollaborator({
    userId,
    values,
    collabortorPermissions,
  }: {
    userId: number;
    values: Insertable<Note>;
    collabortorPermissions: Permission;
  }) {
    return this.db.transaction().execute(async (trx) => {
      // create note and collaborators together
      const [note, collaborator] = await Promise.all([
        await trx
          .insertInto('note')
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

      // link note with collaborator
      const noteCollaborator = await trx
        .insertInto('noteCollaborator')
        .values({
          userId,
          collaboratorId: collaborator.id,
          noteId: note.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return { note, collaborator, noteCollaborator };
    });
  }

  async getNoteById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
  }) {
    const query = this.db
      .selectFrom('note')
      .where('id', '=', id)
      .where('deletedAt', 'is', null);

    if (select !== '*') return query.select(select).executeTakeFirstOrThrow();

    return query.selectAll().executeTakeFirstOrThrow();
  }

  async updateNoteById({
    id,
    values,
  }: {
    id: number;
    values: Updateable<Note>;
  }) {
    return this.db
      .updateTable('note')
      .set(values)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirstOrThrow();
  }

  async deleteNoteById(id: number) {
    return this.db
      .updateTable('note')
      .set({ deletedAt: new Date() })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirstOrThrow();
  }

  async deleteNotesByDirectoryId(directoryId: number, trx?: Transaction<DB>) {
    return (trx || this.db)
      .updateTable('note')
      .set({ deletedAt: new Date() })
      .where('directoryId', '=', directoryId)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .execute();
  }

  async paginateNotesByDirectoryId({
    directoryId,
    select,
    limit,
    cursor,
    orderBy,
  }: {
    directoryId: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
    limit: number;
    cursor?: Date;
    orderBy: OrderBy<'note'>[];
  }) {
    let query = this.db
      .selectFrom('note')
      .where('directoryId', '=', directoryId)
      .where('deletedAt', 'is', null)
      .orderBy(orderBy);

    if (cursor) {
      query = buildQueryWithCursor(query, orderBy, cursor);
      query = query.where('note.createdAt', '<', cursor);
    }

    if (select !== '*') return query.select(select).limit(limit).execute();
    return query.selectAll().limit(limit).execute();
  }
}
