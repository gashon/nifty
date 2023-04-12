import status from 'http-status';
import { controller, httpGet, httpPost, httpDelete } from 'inversify-express-utils';
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
import { setPermissions } from '@/util';
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

  @httpGet('/', auth())
  async getDirectories(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const collaborators = await this.collaboratorService.paginateCollaborators({ user: userId, deleted_at: null }, req.query as PaginationParams);

    //@ts-ignore
    const collaboratorIds = collaborators.data.map(c => c.id);
    const directories = await this.directoryService.findDirectoriesByCollaboratorIds(collaboratorIds)

    res.status(status.OK).json({ data: directories });
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

    const rootCollaborator = await this.collaboratorService.createCollaborator(createdBy, { permissions: setPermissions("rwd"), user: createdBy, type: "directory" });
    const doc = {
      ...(req.body as DirectoryCreateRequest),
      collaborators: [rootCollaborator.id],
    };
    const directory = await this.directoryService.createDirectory(createdBy, doc);

    rootCollaborator.set({ foreign_key: directory.id });
    rootCollaborator.save();

    return res.status(status.CREATED).json({ data: directory });
  }

  @httpDelete("/:id", auth())
  async deleteDirectory(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const directory = await this.directoryService.findDirectoryById(req.params.id);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(directory.id, userId);
    if (!collaborator || !directory.collaborators.includes(collaborator.id))
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    await this.directoryService.deleteDirectoryById(directory.id);
    res.status(status.NO_CONTENT).send();
  }

}