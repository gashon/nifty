import { inject, injectable } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  NoteCollaborator,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { NoteCollaboratorRepository, NoteRepository } from '@nifty/api/domains';
import { Permission, isPermitted } from '@nifty/api/util';
import { OrderBy } from '@nifty/api/types';

@injectable()
export class NoteCollaboratorService {
  constructor(
    @inject(BINDING.NOTE_COLLABORATOR_REPOSITORY)
    private noteCollaboratorRepository: NoteCollaboratorRepository,
    @inject(BINDING.NOTE_REPOSITORY)
    private noteRepository: NoteRepository
  ) {}

  async createNoteCollaborator({
    values,
    returning,
  }: {
    values: Insertable<NoteCollaborator>;
    returning: readonly SelectExpression<DB, 'noteCollaborator'>[];
  }) {
    return this.noteCollaboratorRepository.createNoteCollaborator({
      values,
      returning,
    });
  }

  async userHasPermissionToNote({
    noteId,
    userId,
    permission,
  }: {
    noteId: number;
    userId: number;
    permission: Permission;
  }) {
    const note = await this.noteRepository.getNoteById({
      id: noteId,
      select: ['publicPermissions'],
    });
    const hasPublicPermission = isPermitted(note.publicPermissions, permission);

    if (hasPublicPermission) {
      return true;
    }

    const noteCollaborator =
      await this.noteCollaboratorRepository.getNoteCollaboratorByNoteIdAndUserId(
        {
          noteId,
          userId,
          select: ['collaborator.permissions'],
        }
      );

    if (!noteCollaborator?.permissions) {
      return false;
    }

    const hasCollaboratorPermission = isPermitted(
      noteCollaborator.permissions,
      permission
    );

    return hasCollaboratorPermission;
  }

  async paginateNotesByUserId({
    userId,
    select,
    limit,
    cursor,
    orderBy = 'note.createdAt desc' as OrderBy<'note'>,
  }: {
    userId: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
    limit: number;
    cursor?: Date;
    orderBy?: OrderBy<'note'>;
  }) {
    return this.noteCollaboratorRepository.paginateNotesByUserId({
      userId,
      select,
      limit,
      cursor,
      orderBy,
    });
  }
}
