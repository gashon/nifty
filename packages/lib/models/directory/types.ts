import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IDirectory extends Resource {
  created_by: mongoose.Types.ObjectId;
  name: string;
  parent: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  is_public: boolean;
  deleted_at: number;
}

export type DirectoryDocument = mongoose.Document<string, object, IDirectory>;

export type DirectoryCreateRequest = Partial<Expand<Pick<IDirectory, 'created_by' | 'name' | 'parent' | 'is_public' | 'deleted_at'>>>

export type DirectoryListResponse = ListResponse<IDirectory>