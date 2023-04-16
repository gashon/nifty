import { Request, Response } from 'express';
import { FilterQuery, Query } from 'mongoose';

import { INote, NoteDocument, NoteListResponse } from "@nifty/server-lib/models/note";
import { INoteDiagram, NoteDiagramDocument } from "@nifty/server-lib/models/note-diagram";
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
  findNotesByIds(ids: string[]): Promise<Query<(NoteDocument & Required<{ _id: string; }>)[], NoteDocument & Required<{ _id: string; }>, {}, NoteDocument>>
  updateNoteById(id: string, data: Partial<INote>): Promise<Query<any, NoteDocument & Required<{ _id: string; }>, {}, NoteDocument>>
  deleteNoteById(id: string): Promise<Query<any, NoteDocument & Required<{ _id: string; }>, {}, NoteDocument>>;
  paginateNotesByCollaboratorId(collaboratorId: string, query: PaginationParams): Promise<Partial<NoteListResponse>>
  findNoteNeighbors(noteId: string, directoryId: string, sortBy: string, limit: number): Promise<{ before: NoteDocument[], after: NoteDocument[] }>
  paginateNotesByDirectoryId(directoryId: string, query: PaginationParams): Promise<Partial<NoteListResponse>>
  getKMostRecentNotes(userId: string, k: number): Promise<NoteDocument[]>
  createNoteDiagram(createdBy: string, data: Pick<INoteDiagram, "type" | "content">): Promise<NoteDiagramDocument>
}

export { INote, INoteController, INoteService }; 