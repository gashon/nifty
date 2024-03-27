import { inject } from 'inversify';
import {
  httpGet,
  httpPost,
  httpPatch,
  httpDelete,
  controller,
} from 'inversify-express-utils';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  Note,
  Updateable,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import {
  DirectoryService,
  DirectoryNoteService,
  DirectoryCollaboratorService,
  NoteService,
  NoteCollaboratorService,
} from '@nifty/api/domains';
import type {
  CreateNotesResponse,
  GetNotesResponse,
  GetNoteResponse,
} from '@nifty/api/domains';
import type { ExpressResponse } from '@nifty/api/domains/dto';
import { Permission } from '@nifty/api/util';
import { PaginationParams } from '@nifty/api/types';
import auth from '@nifty/api/middlewares/auth';

@controller('/v1/notes')
export class NoteController {
  constructor(
    @inject(BINDING.DIRECTORY_SERVICE)
    private directoryService: DirectoryService,
    @inject(BINDING.DIRECTORY_NOTE_SERVICE)
    private directoryNoteService: DirectoryNoteService,
    @inject(BINDING.DIRECTORY_COLLABORATOR_SERVICE)
    private directoryCollaboratorService: DirectoryCollaboratorService,
    @inject(BINDING.NOTE_SERVICE)
    private noteService: NoteService,
    @inject(BINDING.NOTE_COLLABORATOR_SERVICE)
    private noteCollaboratorService: NoteCollaboratorService
  ) {}

  @httpGet('/recent', auth())
  async getRecentNotes(req: Request, res: Response): Promise<void> {
    res.json({ data: [] });
    return;
  }

  @httpGet('/:id/neighbors', auth())
  async getNoteNeighbors(req: Request, res: Response): Promise<void> {
    res.json({ data: [] });
    return;
  }

  @httpGet('/:id', auth())
  async getNote(req: Request, res: Response): ExpressResponse<GetNoteResponse> {
    const userId = req.locals.user.id;
    const id = req.params.id as GetNoteParam;

    const hasPermission =
      await this.noteCollaboratorService.userHasPermissionToNote({
        noteId: id,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermission) {
      throw new ForbiddenError('User does not have permission to read note');
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
    const userId = req.locals.user.id;
    const { limit, cursor } = req.query as PaginationParams;

    const notes = await this.noteCollaboratorService.paginateNotesByUserId({
      userId,
      limit,
      cursor,
      select: '*',
    });

    return res.json({ data: notes });
  }

  @httpGet('/directories/:id', auth())
  async getDirectoryNotes(
    req: Request,
    res: Response
  ): ExpressResponse<GetDirectoryNotesResponse> {
    const userId = req.locals.user.id;
    const directoryId = req.params.id as GetDirectoryNotesParam;
    const { limit, cursor } = req.query as GetDirectoryNotesQuery;

    const hasPermission =
      await this.directoryCollaboratorService.userHasPermissionToDirectory({
        directoryId,
        userId,
        permission: Permission.Read,
      });
    if (!hasPermission) {
      throw new ForbiddenError(
        'User does not have permission to read directory notes'
      );
    }

    const notes = await this.directoryNoteService.paginateNotesByDirectoryId({
      directoryId,
      limit,
      cursor,
      select: '*',
    });

    return res.json({ data: notes });
  }

  @httpPost('/', auth())
  async createNote(
    req: Request,
    res: Response
  ): ExpressResponse<CreateNoteResponse> {
    const values = req.body as CreateNoteRequest;

    const newNote = await this.noteService.createNote({
      values,
      returning: '*',
    });

    return res.json({ data: newNote });
  }

  @httpPatch('/:id', auth())
  async updateNote(
    req: Request,
    res: Response
  ): ExpressResponse<UpdateNoteResponse> {
    const id = req.params.id as Pick<Note, 'id'>;
    const values = req.body as UpdateNoteRequest;

    await this.noteService.updateNote({
      id,
      values,
    });

    return res.json({ data: id });
  }

  @httpDelete('/:id', auth())
  async deleteNoteById(
    req: Request,
    res: Response
  ): ExpressResponse<DeleteNoteResponse> {
    const id = req.params.id as DeleteNoteParam;

    await this.noteService.deleteNote(id);

    return res.json({ data: id });
  }
}
