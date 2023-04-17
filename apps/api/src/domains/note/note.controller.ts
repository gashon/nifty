import status from 'http-status';
import { controller, httpGet, httpPost, httpPatch, httpDelete } from 'inversify-express-utils';
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
import { setPermissions, Permission, checkPermissions } from '@/util';
import { CollaboratorDocument } from '@nifty/server-lib/models/collaborator';

@controller('/v1/notes')
export class NoteController implements INoteController {
  constructor(
    @inject(NOTE_TYPES.SERVICE) private noteService: INoteService,
    @inject(DIRECTORY_TYPES.SERVICE) private directoryService: IDirectoryService,
    @inject(COLLABORATOR_TYPES.SERVICE) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/recent', auth())
  async getRecentNotes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const k = (req.query.k as number | undefined) ?? 5;

    if (k < 0 || k > 100)
      throw new CustomException('k must be between 0 and 100', status.BAD_REQUEST);

    const collaborators = await this.collaboratorService.findCollaboratorsByType(userId, "note");
    const noteIds = collaborators.map(c => c.foreign_key).filter(id => !!id);

    console.log("HERE", noteIds)
    const notes = await this.noteService.getKMostRecentNotes(noteIds as string[], k);
    res.status(status.OK).json({ data: notes });
  }

  @httpGet('/:id', auth())
  async getNote(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const note = await this.noteService.findNoteById(req.params.id);

    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    if (!checkPermissions(note.public_permissions, Permission.Read) && !note.collaborators.includes(userId))
      throw new CustomException('You do not have access to this note', status.FORBIDDEN);

    // update last viewed at
    const { collaborators } = await note.populate('collaborators');
    const collaborator = collaborators.find((collaborator: any) => collaborator.user === userId) as CollaboratorDocument | undefined;
    if (collaborator) {
      collaborator.set({
        last_viewed_at: new Date()
      })
      collaborator.save();
    }

    res.status(status.OK).json({ data: note });
  }

  @httpGet('/:id/neighbors', auth())
  async getNoteNeighbors(req: Request, res: Response): Promise<void> {

    const { sort, limit } = req.query as PaginationParams;
    const userId = res.locals.user._id;
    const noteId = req.params.id;

    const sortBy = sort || 'created_at';
    // limit must be an even number to get the same number of notes before and after
    if (!limit || limit % 2 !== 0 || limit < 0)
      throw new CustomException('Limit must be an even number', status.BAD_REQUEST);

    const note = await this.noteService.findNoteById(noteId);
    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorByNoteIdAndUserId(noteId, userId);
    if (!checkPermissions(note.public_permissions, Permission.Read) && !collaborator)
      throw new CustomException('You do not have access to this note', status.FORBIDDEN);

    const directory = await this.directoryService.findDirectoryByNoteId(noteId);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    const neighbors = await this.noteService.findNoteNeighbors(noteId, directory.id, sortBy, limit / 2);
    res.status(status.OK).json({ data: neighbors });
  }

  @httpGet('/', auth())
  async getNotes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const directoryId = req.query.directory_id as string | undefined;
    let notes;

    if (directoryId) {
      // validate directory exists
      const directory = await this.directoryService.findDirectoryById(directoryId);
      if (!directory)
        throw new CustomException('Directory not found', status.NOT_FOUND);

      // validate user has access to directory
      const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(directory.id, userId);
      if (!collaborator)
        throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

      const query = { ...req.query, directory_id: undefined } as PaginationParams;
      notes = await this.noteService.paginateNotesByDirectoryId(directoryId, query);
    } else {
      notes = await this.noteService.paginateNotes({
        filter: {
          "collaborators.user": userId
        }
      }, req.query as PaginationParams);
    }


    res.status(status.OK).json({ data: notes });
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

    const noteCollaborator = await this.collaboratorService.createCollaborator(createdBy, { user: createdBy, type: "note", permissions: setPermissions(Permission.ReadWriteDelete) });
    const { public_permissions, ...noteBody } = req.body;
    const note = await this.noteService.createNote(createdBy, {
      public_permissions: setPermissions((public_permissions ?? Permission.None) as Permission),
      collaborators: [noteCollaborator.id],
      ...noteBody,
    } as NoteCreateRequest);

    // add the note to the directory
    directory.set({ notes: [...directory.notes, note.id], collaborators: [...directory.collaborators] });
    noteCollaborator.set({ foreign_key: note.id });

    await Promise.all([
      directory.save(),
      noteCollaborator.save()
    ])

    return res.status(status.CREATED).json({ data: note });
  }

  @httpPatch("/:id", auth())
  async updateNote(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;
    const data = req.body;

    // validate note exists
    const note = await this.noteService.findNoteById(id);
    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorByNoteIdAndUserId(note.id, userId);
    // validate user has access to note
    if (!checkPermissions(note.public_permissions, Permission.ReadWrite) && !collaborator)
      throw new CustomException('You do not have access to this note', status.FORBIDDEN);

    // update note
    const updatedNote = await this.noteService.updateNoteById(id, data);

    res.status(status.OK).json({ data: updatedNote });
  }

  @httpDelete("/:id", auth())
  async deleteNoteById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;

    // validate note exists
    const note = await this.noteService.findNoteById(id);
    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorByForeignKey(note.id, "note", userId);
    // validate user has access to note
    if (!checkPermissions(note.public_permissions, Permission.ReadWriteDelete) && !collaborator)
      throw new CustomException('You do not have access to this note', status.FORBIDDEN);

    // todo handle permissions

    // delete note
    await this.noteService.deleteNoteById(id);

    res.status(status.NO_CONTENT).json();
  }


}