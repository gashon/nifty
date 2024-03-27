import type { AppResponse } from '@nifty/api/domains/dto';
import { PaginationParams } from '@nifty/api/types';
import type {
  Insertable,
  Note,
  Updateable,
  Directory,
} from '@nifty/common/types';

type NoteWithoutDeletedAt = Omit<Note, 'deletedAt'>;

export type CreateNoteRequestBody = Insertable<Note> & {
  directoryId: number | null;
};
export type CreateNoteResponse = AppResponse<NoteWithoutDeletedAt>;

export type GetNoteRequestParam = number;
export type GetNoteResponse = AppResponse<Note>;

export type GetUserNotesResponse = AppResponse<Note[]>;

export type GetDirectoryNotesRequestParam = number;
export type GetDirectoryNotesRequestQuery = PaginationParams;
export type GetDirectoryNotesResponse = AppResponse<Note[]>;

export type UpdateNoteRequestBody = Updateable<Note>;
export type UpdateNoteRequestParam = number;
export type UpdateNoteResponse = AppResponse<{ id: Pick<Note, 'id'> }>;

export type DeleteNoteRequestParam = number;
export type DeleteNoteResponse = AppResponse<{ id: Pick<Note, 'id'> }>;
