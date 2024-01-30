import { PaginateMethod } from '../../mongoose/plugins/mongoose-paginate';
import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface INote extends Resource {
  created_by: string;
  title: string;
  content: string;
  description: string;
  collaborators: string[];
  img_url: string;
  tags: string[];
  public_permissions: number; // unix permissions
}

export type NoteDocument = mongoose.Document<string, object, INote> & INote;

type NoteStaticMethods = PaginateMethod<INote>;

export type NoteModel = mongoose.Model<INote> & NoteStaticMethods;

export type NoteCreateRequest = Partial<
  Expand<Pick<INote, 'public_permissions' | 'title' | 'description'>>
>;
export type NoteUpdateRequest = Partial<Expand<Omit<INote, 'created_by'>>>;

export type NoteListResponse = ListResponse<INote>;
