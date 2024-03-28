import { inject } from 'inversify';
import {
  httpGet,
  httpPost,
  httpPatch,
  httpDelete,
  controller,
} from 'inversify-express-utils';
import type { Request, Response } from 'express';
import status from 'http-status';

import { BINDING } from '@nifty/api/domains/binding';
import {
  DirectoryService,
  DirectoryCollaboratorService,
  NoteService,
  NoteCollaboratorService,
} from '@nifty/api/domains';
import type {
  GetNoteRequestParam,
  GetNoteResponse,
  GetUserNotesResponse,
  GetDirectoryNotesRequestParam,
  GetDirectoryNotesRequestQuery,
  GetDirectoryNotesResponse,
  CreateNoteRequestBody,
  CreateNoteResponse,
  UpdateNoteRequestBody,
  DeleteNoteRequestParam,
  UpdateNoteResponse,
  DeleteNoteResponse,
  UpdateNoteRequestParam,
  GetUserNotesRequestQuery,
} from '@nifty/api/domains/note/dto';
import type { ExpressResponse } from '@nifty/api/domains/dto';
import { Permission } from '@nifty/api/util';
import { PaginationParams } from '@nifty/api/types';
import auth from '@nifty/api/middlewares/auth';
import { CustomException } from '@nifty/api/exceptions';
import { authGuard } from '@nifty/api/middlewares/guards/auth';
import { getPaginationMeta } from '@nifty/api/util/pagination';

@controller('/v1/notes')
export class NoteController {
  constructor(
    @inject(BINDING.DIRECTORY_SERVICE)
    private directoryService: DirectoryService,
    @inject(BINDING.DIRECTORY_COLLABORATOR_SERVICE)
    private directoryCollaboratorService: DirectoryCollaboratorService,
    @inject(BINDING.NOTE_SERVICE)
    private noteService: NoteService,
    @inject(BINDING.NOTE_COLLABORATOR_SERVICE)
    private noteCollaboratorService: NoteCollaboratorService
  ) {}

  @httpGet('/:id/neighbors', auth())
  async getNoteNeighbors(req: Request, res: Response): Promise<void> {
    res.json({ data: [] });
    return;
  }

  @httpGet('/:id', auth())
  async getNote(req: Request, res: Response): ExpressResponse<GetNoteResponse> {
    const userId = res.locals.user.id;
    const id = Number(req.params.id) as GetNoteRequestParam;

    const hasPermission =
      await this.noteCollaboratorService.userHasPermissionToNote({
        noteId: id,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermission) {
      throw new CustomException(
        'User does not have permission to read note',
        status.FORBIDDEN
      );
    }

    const note = await this.noteService.getNoteById({
      id,
      select: '*',
    });

    return res.json({ data: note });
  }

  @httpGet('/', auth())
  async getUserNotes(
    req: Request,
    res: Response
  ): ExpressResponse<GetUserNotesResponse> {
    const userId = res.locals.user.id;
    const { limit, cursor, orderBy } = req.query as GetUserNotesRequestQuery;

    const cursorDate = cursor ? new Date(cursor) : undefined;
    const notes = await this.noteCollaboratorService.paginateNotesByUserId({
      userId,
      limit: Number(limit),
      cursor: cursorDate,
      select: '*',
      orderBy,
    });

    return res.json({ data: notes });
  }

  @httpGet('/directories/:id')
  @authGuard()
  async getDirectoryNotes(
    req: Request,
    res: Response
  ): ExpressResponse<GetDirectoryNotesResponse> {
    const userId = res.locals.user.id;
    const directoryId = Number(req.params.id) as GetDirectoryNotesRequestParam;
    const { limit, cursor, orderBy } =
      req.query as GetDirectoryNotesRequestQuery;

    const hasPermission =
      await this.directoryCollaboratorService.userHasPermissionToDirectory({
        directoryId,
        userId,
        permission: Permission.Read,
      });
    if (!hasPermission) {
      throw new CustomException(
        'User does not have permission to read directory',
        status.FORBIDDEN
      );
    }

    const cursorDate = cursor ? new Date(cursor) : undefined;
    const notes = await this.noteService.paginateNotesByDirectoryId({
      directoryId,
      limit: Number(limit),
      cursor: cursorDate,
      select: '*',
      orderBy,
    });

    return res.json({
      data: notes,
      pagination: getPaginationMeta(notes, limit),
    });
  }

  @httpPost('/', auth())
  async createNote(
    req: Request,
    res: Response
  ): ExpressResponse<CreateNoteResponse> {
    const userId = res.locals.user.id;
    const { directoryId, ...values } = req.body as CreateNoteRequestBody;

    const { note } = await this.noteService.createNoteAndCollaborator({
      values: { ...values, createdBy: userId },
      userId,
      directoryId,
      // Default to read-write-delete permission for the creator
      collabortorPermissions: Permission.ReadWriteDelete,
    });

    return res.json({ data: note });
  }

  @httpPatch('/:id', auth())
  async updateNote(
    req: Request,
    res: Response
  ): ExpressResponse<UpdateNoteResponse> {
    const userId = res.locals.user.id;
    const id = Number(req.params.id) as UpdateNoteRequestParam;
    const values = req.body as UpdateNoteRequestBody;

    const hasPermission =
      await this.noteCollaboratorService.userHasPermissionToNote({
        userId,
        noteId: id,
        permission: Permission.ReadWrite,
      });

    if (!hasPermission) {
      throw new CustomException(
        'User does not have permission to update note',
        status.FORBIDDEN
      );
    }

    await this.noteService.updateNoteById({
      id,
      values,
    });

    return res.json({ data: { id } });
  }

  @httpDelete('/:id', auth())
  async deleteNoteById(
    req: Request,
    res: Response
  ): ExpressResponse<DeleteNoteResponse> {
    const userId = res.locals.user.id;
    const id = Number(req.params.id) as DeleteNoteRequestParam;

    const hasPermission =
      await this.noteCollaboratorService.userHasPermissionToNote({
        userId,
        noteId: id,
        permission: Permission.ReadWriteDelete,
      });

    if (!hasPermission) {
      throw new CustomException(
        'User does not have permission to delete note',
        status.FORBIDDEN
      );
    }

    await this.noteService.deleteNoteById(id);

    return res.json({ data: { id } });
  }
}
