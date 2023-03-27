import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IDirectory extends Resource {
  created_by: string;
  name: string;
  parent: string;
  collaborators: string[];
  is_public: boolean;
}

export type DirectoryDocument = mongoose.Document<string, object, IDirectory>;

export type DirectoryCreateRequest = Partial<Expand<Pick<IDirectory, 'name' | 'is_public' | 'parent'>>>

export type DirectoryListResponse = ListResponse<IDirectory>