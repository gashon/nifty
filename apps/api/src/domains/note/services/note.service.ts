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
import { Permission } from '@nifty/api/util';

@injectable()
export class NoteService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private noteRepository: NoteRepository
  ) {}

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
    return this.noteRepository.createNoteAndCollaborator({
      userId,
      directoryId,
      values,
      collabortorPermissions,
    });
  }

  async getNoteById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
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
    return this.noteRepository.paginateNotesByDirectoryId({
      directoryId,
      select,
      limit,
      cursor,
    });
  }
}
