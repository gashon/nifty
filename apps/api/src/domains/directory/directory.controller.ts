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
  INoteService
} from "@/domains/note"
import {
  ICollaboratorService,
} from "@/domains/collaborator"
import { DIRECTORY_TYPES, DirectoryCreateResponse } from '@/domains/directory/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
import { setPermissions, Permission } from '@/util';
import { NOTE_TYPES } from '../note';
@controller('/v1/directories')
export class DirectoryController implements IDirectoryController {
  constructor(
    @inject(DIRECTORY_TYPES.SERVICE) private directoryService: IDirectoryService,
    @inject(NOTE_TYPES.SERVICE) private noteService: INoteService,
    @inject(COLLABORATOR_TYPES.SERVICE) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/recent', auth())
  async getRecentNotes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const k = (req.query.k as number | undefined) ?? 5;

    if (k < 0 || k > 100)
      throw new CustomException('k must be between 0 and 100', status.BAD_REQUEST);

    const collaborators = await this.collaboratorService.findCollaboratorsByType(userId, "directory");
    const directoryIds = collaborators.map(c => c.foreign_key).filter(id => !!id);

    const notes = await this.directoryService.getKMostRecentDirectories(directoryIds as string[], k);

    res.status(status.OK).json({ data: notes });
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

    const rootCollaborator = await this.collaboratorService.createCollaborator(createdBy, { permissions: setPermissions(Permission.ReadWriteDelete), user: createdBy, type: "directory" });
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
    if (!collaborator || !directory.collaborators.includes(collaborator._id))
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    const noteDeletions = directory.notes.map((noteId) => this.noteService.deleteNoteById(noteId));

    await Promise.all([
      ...noteDeletions,
      this.directoryService.deleteDirectoryById(directory.id)
    ])

    res.status(status.NO_CONTENT).send();
  }

}