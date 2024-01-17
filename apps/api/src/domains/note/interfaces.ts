import { Request, Response } from 'express';
import { FilterQuery, Query } from 'mongoose';

import Note, { INote, NoteListResponse } from '@nifty/server-lib/models/note';
import { NoteCreateResponse } from '@/domains/note/types';
import { PaginationParams } from '@/types';

interface INoteController {
  getNote(req: Request, res: Response): Promise<void>;
  createNote(
    req: Request,
    res: Response
  ): Promise<Response<NoteCreateResponse>>;
  getNotes(req: Request, res: Response): Promise<void>;
}

interface INoteService {
  findNoteById(id: string): ReturnType<typeof Note.findById>;
  createNote(createdBy: string, data: Partial<INote>): Promise<INote>;
  paginateNotes(
    condition: FilterQuery<INote>,
    query: PaginationParams
  ): Promise<Partial<NoteListResponse>>;
  findNotesByIds(
    ids: string[]
  ): Promise<
    Query<
      (INote & Required<{ _id: string }>)[],
      INote & Required<{ _id: string }>,
      {},
      INote
    >
  >;
  updateNoteById(
    id: string,
    data: Partial<INote>
  ): Promise<Query<any, INote & Required<{ _id: string }>, {}, INote>>;
  deleteNoteById(
    id: string
  ): Promise<Query<any, INote & Required<{ _id: string }>, {}, INote>>;
  paginateNotesByCollaboratorId(
    collaboratorId: string,
    query: PaginationParams
  ): Promise<Partial<NoteListResponse>>;
  findNoteNeighbors(
    noteId: string,
    directoryId: string,
    sortBy: string,
    limit: number
  ): Promise<{ before: INote[]; after: INote[] }>;
  paginateNotesByDirectoryId(
    directoryId: string,
    query: PaginationParams
  ): Promise<Partial<NoteListResponse>>;
  getKMostRecentNotes(ids: string[], k: number): Promise<INote[]>;
}

export type { INote, INoteController, INoteService };
