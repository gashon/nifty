import mongoose from "../../mongoose";
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
  is_public: boolean;
}

export type NoteDocument = mongoose.Document<string, object, INote>;

export type NoteCreateRequest = Partial<Expand<Pick<INote, 'title' | 'description' | 'is_public'>>>
export type NoteUpdateRequest = Partial<Expand<Omit<INote, 'created_by'>>>

export type NoteListResponse = ListResponse<NoteDocument>