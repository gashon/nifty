import { INote } from './interfaces';

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

