import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  DirectoryCollaborator,
  Transaction,
  Directory,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { OrderBy } from '@nifty/api/types';

@injectable()
export class DirectoryCollaboratorRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createDirectoryCollaborator(
    {
      values,
      returning,
    }: {
      values: Insertable<DirectoryCollaborator>;
      returning: readonly SelectExpression<DB, 'directoryCollaborator'>[];
    },
    trx?: Transaction<DB>
  ) {
    return (trx || this.db)
      .insertInto('directoryCollaborator')
      .values(values)
      .returning(returning)
      .executeTakeFirst();
  }

  async getDirectoryById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'directoryCollaborator'>[];
  }) {
    return this.db
      .selectFrom('directoryCollaborator')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
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
    select: readonly SelectExpression<DB, 'note'>[];
    limit: number;
    cursor?: Date;
  }) {
    const query = this.db
      .selectFrom('directoryNote')
      .where('directoryNote.directoryId', '=', directoryId)
      .innerJoin('note', 'note.id', 'directoryNote.noteId')
      .where('note.deletedAt', 'is', null)
      .select(select)
      .orderBy('note.createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      query.where('note.createdAt', '<', cursor);
    }

    return query.execute();
  }

  async paginateDirectoriesByUserId({
    userId,
    limit,
    cursor,
    orderBy = ['directory.createdAt desc'],
  }: {
    userId: number;
    limit: number;
    cursor?: Date;
    orderBy?: OrderBy<'directory'>[];
  }) {
    let query = this.db
      .selectFrom('directoryCollaborator')
      .where('directoryCollaborator.userId', '=', userId)
      .innerJoin(
        'directory',
        'directory.id',
        'directoryCollaborator.directoryId'
      )
      .where('directory.deletedAt', 'is', null)
      .where('directoryCollaborator.deletedAt', 'is', null)
      .selectAll()
      .orderBy(orderBy)
      .limit(limit);

    if (cursor) {
      for (const str of orderBy) {
        const [column, order] = str.split(' ') as [
          keyof Directory,
          'asc' | 'desc'
        ];
        query = query.where(column, order === 'asc' ? '>' : '<', cursor);
      }
    }

    return query.execute();
  }

  async getDirectoryCollaboratorByDirectoryIdAndUserId({
    directoryId,
    userId,
    select,
  }: {
    directoryId: number;
    userId: number;
    select: readonly SelectExpression<
      DB,
      'directoryCollaborator' | 'directory' | 'collaborator'
    >[];
  }) {
    return (
      this.db
        .selectFrom('directoryCollaborator')
        .where('directoryId', '=', directoryId)
        .innerJoin(
          'collaborator',
          'collaborator.id',
          'directoryCollaborator.collaboratorId'
        )
        // sql will optimize this join out if unused in select
        .innerJoin(
          'directory',
          'directory.id',
          'directoryCollaborator.directoryId'
        )
        .where('directoryCollaborator.userId', '=', userId)
        .select(select)
        .executeTakeFirst()
    );
  }
}
