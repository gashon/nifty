import { injectable, inject } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  Note,
  DB,
  Updateable,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { NoteRepository } from '@nifty/api/domains';

@injectable()
export class NoteService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private noteRepository: NoteRepository
  ) {}

  async createNote({
    values,
    returning,
  }: {
    values: Insertable<Note>;
    returning: readonly SelectExpression<DB, 'note'>[] | '*';
  }) {
    return this.noteRepository.createNote({
      values,
      returning,
    });
  }

  async getNoteById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'note'>[];
  }) {
    return this.noteRepository.getNoteById({
      id,
      select,
    });
  }

  async updateNoteById({
    id,
    values,
  }: {
    id: number;
    values: Updateable<Note>;
  }) {
    return this.noteRepository.updateNoteById({
      id,
      values,
    });
  }

  async deleteNoteById(id: number) {
    return this.noteRepository.deleteNoteById(id);
  }
}
