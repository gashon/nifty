import { injectable, inject } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  DirectoryCollaborator,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { DirectoryCollaboratorRepository } from '@nifty/api/domains';
import { Permission, isPermitted } from '@nifty/api/util';
import { OrderBy } from '@nifty/api/types';

@injectable()
export class DirectoryCollaboratorService {
  constructor(
    @inject(BINDING.DIRECTORY_COLLABORATOR_REPOSITORY)
    private directoryCollaboratorRepository: DirectoryCollaboratorRepository
  ) {}

  async createDirectoryCollaborator({
    values,
    returning,
  }: {
    values: Insertable<DirectoryCollaborator>;
    returning: readonly SelectExpression<DB, 'directoryCollaborator'>[];
  }) {
    return this.directoryCollaboratorRepository.createDirectoryCollaborator({
      values,
      returning,
    });
  }

  async userHasPermissionToDirectory({
    directoryId,
    userId,
    permission,
  }: {
    directoryId: number;
    userId: number;
    permission: Permission;
  }) {
    const res =
      await this.directoryCollaboratorRepository.getDirectoryCollaboratorByDirectoryIdAndUserId(
        {
          directoryId,
          userId,
          select: ['collaborator.permissions'],
        }
      );

    if (!res) {
      return false;
    }

    const hasCollaboratorPermission = isPermitted(res.permissions, permission);

    return hasCollaboratorPermission;
  }

  async paginateDirectoriesByUserId({
    userId,
    limit,
    cursor,
    orderBy = 'directory.createdAt desc',
  }: {
    userId: number;
    limit: number;
    cursor?: Date;
    orderBy?: OrderBy<'directory'>;
  }) {
    return this.directoryCollaboratorRepository.paginateDirectoriesByUserId({
      userId,
      limit,
      cursor,
      orderBy,
    });
  }
}
