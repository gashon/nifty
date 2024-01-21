import type { INote } from '@nifty/server-lib/models/note';

export enum NOTE_TYPES {
  SERVICE = 'NoteService',
  MODEL = 'NoteModel',
  CONTROLLER = 'NoteController',
}

export type NoteCreateResponse = {
  data: INote;
};
export type NoteUpdateResponse = {
  data: INote;
};
