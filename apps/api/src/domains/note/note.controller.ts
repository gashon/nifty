import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@/middlewares/auth';
import { CustomException } from '@/exceptions';
import { NoteCreateRequest } from '@nifty/server-lib/models/note';
import { PaginationParams } from '@/types';
import {
  INoteService,
  INoteController,
} from "@/domains/note"
import {
  ICollaboratorService,
} from "@/domains/collaborator"
import { IDirectoryService } from '../directory';
import { NOTE_TYPES, NoteCreateResponse } from '@/domains/note/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
import { DIRECTORY_TYPES } from '@/domains/directory/types';

@controller('/v1/notes')
export class NoteController implements INoteController {
  constructor(
    @inject(NOTE_TYPES.SERVICE) private noteService: INoteService,
    @inject(DIRECTORY_TYPES.SERVICE) private directoryService: IDirectoryService,
    @inject(COLLABORATOR_TYPES.SERVICE) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/:id', auth())
  async getNote(req: Request, res: Response): Promise<void> {
    const note = await this.noteService.findNoteById(req.params.id);
    res.status(status.OK).json({ data: note });
  }

  @httpGet('/', auth())
  async getNotes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const directoryId = req.query.directory_id as string;

    // validate directory exists
    const directory = await this.directoryService.findDirectoryById(directoryId);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    // validate user has access to directory
    const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(directory.id, userId);
    if (!collaborator)
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    const noteIds = directory.notes;
    const data = await this.noteService.findNotesByIds(noteIds);
    res.status(status.OK).json({ data });
  }

  @httpPost("/", auth())
  async createNote(req: Request, res: Response): Promise<Response<NoteCreateResponse>> {
    const createdBy = res.locals.user._id;
    const directoryId = req.body.directory_id;

    // validate directory exists
    const directory = await this.directoryService.findDirectoryById(directoryId);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    // validate user has access to directory
    const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(directory.id, createdBy);
    if (!collaborator)
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    const note = await this.noteService.createNote(createdBy, req.body as NoteCreateRequest);

    // add the note to the directory
    directory.set({ notes: [...directory.notes, note.id] });
    await directory.save();

    return res.status(status.CREATED).json({ data: note });
  }

}