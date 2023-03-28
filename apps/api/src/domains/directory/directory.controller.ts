import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@/middlewares/auth';
import { CustomException } from '@/exceptions';
import { DirectoryCreateRequest } from '@nifty/server-lib/models/directory';
import { PaginationParams } from '@/types';
import {
  IDirectoryService,
  IDirectoryController,
} from "@/domains/directory"
import {
  ICollaboratorService,
} from "@/domains/collaborator"
import { DIRECTORY_TYPES, DirectoryCreateResponse } from '@/domains/directory/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
@controller('/v1/directories')
export class DirectoryController implements IDirectoryController {
  constructor(
    @inject(DIRECTORY_TYPES.SERVICE) private directoryService: IDirectoryService,
    @inject(COLLABORATOR_TYPES.SERVICE) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/:id')
  async getDirectory(req: Request, res: Response): Promise<void> {
    const directory = await this.directoryService.findDirectoryById(req.params.id);
    res.status(status.OK).json({ data: directory });
  }

  @httpGet('/')
  async getDirectories(req: Request, res: Response): Promise<void> {
    const directory = await this.directoryService.paginateDirectories(req.query as PaginationParams);
    res.status(status.OK).json({ data: directory });
  }

  @httpPost("/", auth())
  async createDirectory(req: Request, res: Response): Promise<Response<DirectoryCreateResponse>> {
    const createdBy = res.locals.user._id;
    // validate parent
    const parent = await this.directoryService.findDirectoryById(req.body.parent);
    if (parent && parent._id) {
      const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(parent._id, createdBy);
      if (!collaborator)
        throw new CustomException('You do not have access to this directory', status.FORBIDDEN);
    }

    const directory = await this.directoryService.createDirectory(createdBy, req.body as DirectoryCreateRequest);
    return res.status(status.CREATED).json({ data: directory });
  }

}