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
import { NOTE_TYPES, NoteCreateResponse } from '@/domains/note/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';

@controller('/v1/directories')
export class NoteController implements INoteController {
  constructor(
    @inject(NOTE_TYPES.SERVICE) private noteService: INoteService,
    @inject(COLLABORATOR_TYPES.SERVICE) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/:id', auth())
  async getNote(req: Request, res: Response): Promise<void> {
    const note = await this.noteService.findNoteById(req.params.id);
    res.status(status.OK).json({ data: note });
  }

  @httpGet('/', auth())
  async getNotes(req: Request, res: Response): Promise<void> {
    const directoryId = req.query.directoryId as string;
    const data = await this.noteService.paginateNotes({ directory: directoryId }, req.query as PaginationParams);
    res.status(status.OK).json(data);
  }

  @httpPost("/", auth())
  async createNote(req: Request, res: Response): Promise<Response<NoteCreateResponse>> {
    const createdBy = res.locals.user._id;

    // const doc = { ...(req.body satisfies NoteCreateRequest), created_by: createdBy }


    // 
    // validate parent
    // const parent = await this.noteService.findNoteById(req.body.parent);
    // if (parent && parent._id) {
    //   const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(parent._id, createdBy);
    //   if (!collaborator)
    //     throw new CustomException('You do not have access to this note', status.FORBIDDEN);
    // }

    const note = await this.noteService.createNote(createdBy, req.body satisfies NoteCreateRequest);
    return res.status(status.CREATED).json({ data: note });
  }

}