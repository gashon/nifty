import { inject, injectable } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  NoteCollaborator,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { NoteCollaboratorRepository } from '@nifty/api/domains';
import { Permission, isPermitted } from '@nifty/api/util';

@injectable()
export class NoteCollaboratorService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private noteCollaboratorRepository: NoteCollaboratorRepository
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
    const res =
      await this.noteCollaboratorRepository.getNoteCollaboratorByNoteIdAndUserId(
        {
          noteId,
          userId,
          select: ['note.publicPermissions', 'collaborator.permissions'],
        }
      );

    if (!res) {
      return false;
    }

    const hasPublicPermission = isPermitted(
      res.note.publicPermissions,
      permission
    );
    const hasCollaboratorPermission = isPermitted(
      res.collaborator.permissions,
      permission
    );

    return hasPublicPermission || hasCollaboratorPermission;
  }

  async paginateNotesByUserId({
    userId,
    select,
    limit,
    cursor,
  }: {
    userId: number;
    select: readonly SelectExpression<DB, 'note'>[] | '*';
    limit: number;
    cursor?: Date;
  }) {
    return this.noteCollaboratorRepository.paginateNotesByUserId({
      userId,
      select,
      limit,
      cursor,
    });
  }
}