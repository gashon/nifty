import type {
  AppPaginationResponse,
  AppResponse,
} from '@nifty/api/domains/dto';
import { PaginationParams, PaginationQueryParams } from '@nifty/api/types';
import type {
  Insertable,
  Note,
  Updateable,
  Directory,
  Selectable,
} from '@nifty/common/types';

type NoteWithoutDeletedAt = Omit<Note, 'deletedAt'>;

export type GetNoteNeighborsRequestQuery = Omit<
  PaginationQueryParams<'note'>,
  'cursor' | 'orderBy'
> & {
  // ensure note has directory
  validateNoteHasDirectory?: string;
};
export type GetNoteNeighborsResponse = {
  before: Selectable<Note>[];
  after: Selectable<Note>[];
};

export type CreateNoteRequestBody = Omit<Insertable<Note>, 'createdBy'> & {
  directoryId: number | null;
};
export type CreateNoteResponse = AppResponse<NoteWithoutDeletedAt>;

export type GetNoteRequestParam = number;
export type GetNoteResponse = AppResponse<Selectable<Note>>;

export type GetUserNotesRequestQuery = PaginationQueryParams<'note'>;
export type GetUserNotesResponse = AppPaginationResponse<Selectable<Note>>;

export type GetDirectoryNotesRequestParam = number;
export type GetDirectoryNotesRequestQuery = PaginationQueryParams<'note'>;
export type GetDirectoryNotesResponse = AppPaginationResponse<Selectable<Note>>;

export type UpdateNoteRequestBody = Updateable<Note>;
export type UpdateNoteRequestParam = number;
export type UpdateNoteResponse = AppResponse<Selectable<Note>>;

export type DeleteNoteRequestParam = number;
export type DeleteNoteResponse = AppResponse<Pick<Selectable<Note>, 'id'>>;
