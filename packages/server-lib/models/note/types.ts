import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface INote extends Resource {
  created_by: string;
  title: string;
  content: string;
  description: string;
  directory: string;
  collaborators: string[];
  img_url: string;
  tags: string[];
  is_public: boolean;
}

export type NoteDocument = mongoose.Document<string, object, INote>;

export type NoteCreateRequest = Partial<Expand<Pick<INote, | 'title' | 'content' | 'description' | 'directory' | 'collaborators' | 'img_url' | 'tags' | 'is_public' | 'deleted_at'>>>

export type NoteListResponse = ListResponse<NoteDocument>