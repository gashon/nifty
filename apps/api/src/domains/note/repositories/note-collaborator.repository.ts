import { injectable, inject } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  NoteCollaborator,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { OrderBy } from '@nifty/api/types';

@injectable()
export class NoteCollaboratorRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createNoteCollaborator({
    values,
    returning,
  }: {
    values: Insertable<NoteCollaborator>;
    returning: readonly SelectExpression<DB, 'noteCollaborator'>[];
  }) {
    return this.db
      .insertInto('noteCollaborator')
      .values(values)
      .returning(returning)
      .executeTakeFirst();
  }

  getNoteCollaboratorByNoteIdAndUserId({
    noteId,
    userId,
    select,
  }: {
    noteId: number;
    userId: number;
    select: readonly SelectExpression<
      DB,
      'noteCollaborator' | 'note' | 'collaborator'
    >[];
  }) {
    return (
      this.db
        .selectFrom('noteCollaborator')
        .where('noteId', '=', noteId)
        .innerJoin(
          'collaborator',
          'collaborator.id',
          'noteCollaborator.collaboratorId'
        )
        // sql will optimize this join out if unused in select
        .innerJoin('note', 'note.id', 'noteCollaborator.noteId')
        .where('noteCollaborator.userId', '=', userId)
        .select(select)
        .executeTakeFirst()
    );
  }

  async getNoteCollaboratorsByNoteId({
    noteId,
    select,
  }: {
    noteId: number;
    select: readonly SelectExpression<DB, 'noteCollaborator'>[];
  }) {
    return this.db
      .selectFrom('noteCollaborator')
      .where('noteCollaborator.noteId', '=', noteId)
      .innerJoin('note', 'note.id', 'noteCollaborator.noteId')
      .where('note.deletedAt', 'is', null)
      .select(select)
      .execute();
  }

  async getNearbyNotesByNoteIdAndUserId({
    noteId,
    directoryId,
    createdAt,
    userId,
    limit,
  }: {
    noteId: number;
    userId: number;
    directoryId: number | null;
    createdAt: Date;
    limit: number;
  }) {
    const [before, after] = await Promise.all([
      this.db
        .selectFrom('note')
        .where((eb) => {
          return directoryId === null
            ? eb('note.directoryId', 'is', null)
            : eb('note.directoryId', '=', directoryId);
        })
        .where('note.directoryId', '=', directoryId)
        .where('note.id', '<>', noteId)
        .where('note.deletedAt', 'is', null)
        .where('note.createdAt', '<', createdAt)
        .innerJoin('noteCollaborator', 'noteCollaborator.noteId', 'note.id')
        .where('noteCollaborator.userId', '=', userId)
        .selectAll()
        .orderBy('note.createdAt', 'desc')
        .limit(limit)
        .execute(),
      this.db
        .selectFrom('note')
        .where((eb) => {
          return directoryId === null
            ? eb('note.directoryId', 'is', null)
            : eb('note.directoryId', '=', directoryId);
        })
        .where('note.id', '<>', noteId)
        .where('note.deletedAt', 'is', null)
        .where('note.createdAt', '>', createdAt)
        .innerJoin('noteCollaborator', 'noteCollaborator.noteId', 'note.id')
        .where('noteCollaborator.userId', '=', userId)
        .selectAll()
        .orderBy('note.createdAt', 'asc')
        .limit(limit)
        .execute(),
    ]);

    return { before, after };
  }

  async paginateNotesByUserId({
    userId,
    select,
    limit,
    cursor,
    orderBy,
  }: {
    userId: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
    limit: number;
    cursor?: Date;
    orderBy: OrderBy<'note'>;
  }) {
    let query = this.db
      .selectFrom('noteCollaborator')
      .innerJoin('note', 'note.id', 'noteCollaborator.noteId')
      .where('noteCollaborator.userId', '=', userId)
      .where('note.deletedAt', 'is', null);

    if (cursor) {
      query = query.where('note.createdAt', '<', cursor);
    }

    if (select !== '*')
      return query.select(select).orderBy(orderBy).limit(limit).execute();

    return query.selectAll().orderBy(orderBy).limit(limit).execute();
  }
}
