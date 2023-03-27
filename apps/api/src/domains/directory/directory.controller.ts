import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { DirectoryCreateRequest } from '@nifty/server-lib/models/directory';
import { CustomException } from '@/exceptions';
import { IDirectoryService, IDirectoryController } from './interfaces';
import { TYPES } from "./types";
import { TYPES as COLLABORATOR_TYPES } from "../collaborator/types";
import { ICollaboratorService } from '../collaborator';
import auth from '@/middleware/auth';

@controller('/v1/directories')
export class DirectoryController implements IDirectoryController {
  constructor(
    @inject(TYPES.DirectoryService) private directoryService: IDirectoryService,
    @inject(COLLABORATOR_TYPES.CollaboratorService) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/:id')
  async getDirectory(req: Request, res: Response): Promise<void> {
    const directory = await this.directoryService.findDirectoryById(req.params.id);
    res.status(status.OK).json({ data: directory });
  }

  @httpPost("/", auth())
  async createDirectory(req: Request, res: Response): Promise<void> {
    const createdBy = res.locals.user._id;
    // validate parent
    const parent = await this.directoryService.findDirectoryById(req.body.parent);
    if (parent && parent._id) {
      const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(parent._id, createdBy);
      if (!collaborator)
        throw new CustomException('You do not have access to this directory', status.FORBIDDEN);
    }

    const directory = await this.directoryService.createDirectory(createdBy, req.body as DirectoryCreateRequest);
    res.status(status.CREATED).json({ data: directory });
  }

}