import { inject, injectable } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  Note,
  Updateable,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { Permission } from '@nifty/api/util';
import { OrderBy } from '@nifty/api/types';
import { buildQueryWithCursor } from '@nifty/api/util/pagination';

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
    directoryId,
    values,
    collabortorPermissions,
  }: {
    userId: number;
    directoryId: number | null;
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

      // link note with collaborator and optional directory
      const jobs = [
        trx
          .insertInto('noteCollaborator')
          .values({
            userId,
            collaboratorId: collaborator.id,
            noteId: note.id,
          })
          .returningAll()
          .executeTakeFirstOrThrow(),
        directoryId
          ? trx
              .insertInto('directoryNote')
              .values({
                directoryId,
                noteId: note.id,
              })
              .returningAll()
              .executeTakeFirstOrThrow()
          : null,
      ];

      const [noteCollaborator, directoryNote] = await Promise.all(jobs);

      return { note, collaborator, noteCollaborator, directoryNote };
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
      query = query.where('note.createdAt', '<', cursor);
    }

    if (select !== '*') return query.select(select).limit(limit).execute();
    return query.selectAll().limit(limit).execute();
  }
}
