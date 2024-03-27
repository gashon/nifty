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

    const note = await query.returningAll().executeTakeFirstOrThrow();
    // Remove the deletedAt field from the returned note object
    const { deletedAt, ...sanitizedNote } = note;

    return sanitizedNote;
  }

  async getNoteById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'note'>[];
  }) {
    return this.db
      .selectFrom('note')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .select(select)
      .executeTakeFirstOrThrow();
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
}
