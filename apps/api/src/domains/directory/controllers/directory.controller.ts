import status from 'http-status';
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@nifty/api/middlewares/auth';
import { CustomException } from '@nifty/api/exceptions';
import {
  DirectoryService,
  DirectoryCollaboratorService,
} from '@nifty/api/domains';
import { ExpressResponse } from '../../dto';
import type {
  CreateDirectoryRequestBody,
  CreateDirectoryResponse,
  DeleteDirectoryRequestParam,
  DeleteDirectoryResponse,
  GetDirectoriesRequestQuery,
  GetDirectoriesResponse,
  GetDirectoryRequestParam,
} from '@nifty/api/domains/directory/dto';
import { BINDING } from '@nifty/api/domains/binding';
import { Permission } from '@nifty/api/util';
import { PaginationParams } from '@nifty/api/types';

@controller('/v1/directories')
export class DirectoryController {
  constructor(
    @inject(BINDING.DIRECTORY_SERVICE)
    private directoryService: DirectoryService,
    @inject(BINDING.DIRECTORY_COLLABORATOR_SERVICE)
    private directoryCollaboratorService: DirectoryCollaboratorService
  ) {}

  @httpGet('/:id', auth())
  async getDirectory(
    req: Request,
    res: Response
  ): ExpressResponse<GetDirectoriesResponse> {
    const userId = res.locals.user.id;
    const id = Number(req.params.id);

    const hasPermission =
      await this.directoryCollaboratorService.userHasPermissionToDirectory({
        directoryId: id,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermission) {
      throw new CustomException('Permission denied', status.FORBIDDEN);
    }

    const directory = await this.directoryService.getDirectoryById({
      id,
      select: '*',
    });
    return res.json({ data: directory });
  }

  @httpGet('/', auth())
  async getDirectories(
    req: Request,
    res: Response
  ): ExpressResponse<GetDirectoriesResponse> {
    const userId = res.locals.user.id;
    const { cursor, limit, orderBy } = req.query as GetDirectoriesRequestQuery;

    const cursorDate = cursor ? new Date(cursor) : undefined;
    const directories =
      await this.directoryCollaboratorService.paginateDirectoriesByUserId({
        userId,
        cursor: cursorDate,
        limit: Number(limit),
        orderBy,
      });

    return res.json({ data: directories });
  }

  @httpPost('/', auth())
  async createDirectory(
    req: Request,
    res: Response
  ): Promise<ExpressResponse<CreateDirectoryResponse>> {
    const userId = res.locals.user.id;
    const values = req.body as CreateDirectoryRequestBody;

    const { directory } =
      await this.directoryService.createDirectoryAndCollaborator({
        userId,
        values: { ...values, createdBy: userId },
        // Default permission for the creator
        collabortorPermissions: Permission.ReadWriteDelete,
      });

    return res.json({ data: directory });
  }

  @httpDelete('/:id', auth())
  async deleteDirectory(
    req: Request,
    res: Response
  ): ExpressResponse<DeleteDirectoryResponse> {
    const id = Number(req.params.id) as DeleteDirectoryRequestParam;

    const hasPermission =
      await this.directoryCollaboratorService.userHasPermissionToDirectory({
        directoryId: id,
        userId: res.locals.user.id,
        permission: Permission.ReadWriteDelete,
      });

    if (!hasPermission) {
      throw new CustomException('Permission denied', status.FORBIDDEN);
    }

    await this.directoryService.deleteDirectoryById(id);

    return res.json({ data: { id } });
  }
}
