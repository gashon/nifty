import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  DirectoryNote,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';

@injectable()
export class DirectoryNoteRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createDirectoryNote({
    values,
    returning,
  }: {
    values: Insertable<DirectoryNote>;
    returning: readonly SelectExpression<DB, 'directoryNote'>[];
  }) {
    return this.db
      .insertInto('directoryNote')
      .values(values)
      .returning(returning)
      .executeTakeFirst();
  }

  async getDirectoryNotesByDirectoryId({
    directoryId,
    select,
  }: {
    directoryId: number;
    select: readonly SelectExpression<DB, 'note'>[];
  }) {
    return this.db
      .selectFrom('directoryNote')
      .where('directoryNote.directoryId', '=', directoryId)
      .innerJoin('note', 'note.id', 'directoryNote.noteId')
      .where('note.deletedAt', 'is', null)
      .select(select)
      .execute();
  }

  async getDirectoryByNoteId({
    noteId,
    select,
  }: {
    noteId: number;
    select: readonly SelectExpression<DB, 'directory'>[];
  }) {
    return this.db
      .selectFrom('directoryNote')
      .where('directoryNote.noteId', '=', noteId)
      .innerJoin('directory', 'directory.id', 'directoryNote.directoryId')
      .where('directory.deletedAt', 'is', null)
      .select(select)
      .executeTakeFirst();
  }

  async paginateNotesByDirectoryId({
    directoryId,
    select,
    limit,
    cursor,
  }: {
    directoryId: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
    limit: number;
    cursor?: Date;
  }) {
    let query = this.db
      .selectFrom('directoryNote')
      .where('directoryNote.directoryId', '=', directoryId)
      .innerJoin('note', 'note.id', 'directoryNote.noteId')
      .where('note.deletedAt', 'is', null);

    if (cursor) {
      query = query.where('note.createdAt', '<', cursor);
    }

    if (select !== '*') return query.select(select).limit(limit).execute();
    return query.selectAll().limit(limit).execute();
  }
}
