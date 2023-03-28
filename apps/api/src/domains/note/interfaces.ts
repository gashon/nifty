import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { INote, NoteDocument, NoteListResponse } from "@nifty/server-lib/models/note";
import { NoteCreateResponse } from "@/domains/note/types";
import { PaginationParams } from "@/types";

interface INoteController {
  getNote(req: Request, res: Response): Promise<void>;
  createNote(req: Request, res: Response): Promise<Response<NoteCreateResponse>>
  getNotes(req: Request, res: Response): Promise<void>;
}

interface INoteService {
  findNoteById(id: string): Promise<NoteDocument | null>;
  createNote(createdBy: string, data: Partial<INote>): Promise<NoteDocument>;
  paginateNotes(condition: FilterQuery<NoteDocument>, query: PaginationParams): Promise<Partial<NoteListResponse>>;
  findNotesByIds(ids: string[]): Promise<NoteDocument[]>;
}

export { INote, INoteController, INoteService }; 