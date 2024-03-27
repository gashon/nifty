import type { AppResponse } from '@nifty/api/domains/dto';
import { PaginationParams } from '@nifty/api/types';
import type {
  Insertable,
  Note,
  Updateable,
  Directory,
} from '@nifty/common/types';

type NoteWithoutDeletedAt = Omit<Note, 'deletedAt'>;

export type CreateNoteRequest = Insertable<Note>;
export type CreateNoteResponse = AppResponse<NoteWithoutDeletedAt>;

export type GetNoteParam = Pick<Note, 'id'>;
export type GetNoteResponse = AppResponse<Note>;

export type GetUserNotesResponse = AppResponse<Note[]>;

export type GetDirectoryNotesParam = Pick<Directory, 'id'>;
export type GetDirectoryNotesQuery = PaginationParams;
export type GetDirectoryNotesResponse = AppResponse<Note[]>;

export type UpdateNoteRequest = Updateable<Note>;
export type UpdateNoteResponse = AppResponse<{ id: Pick<Note, 'id'> }>;

export type DeleteNoteParam = Pick<Note, 'id'>;
export type DeleteNoteResponse = AppResponse<{ id: Pick<Note, 'id'> }>;
