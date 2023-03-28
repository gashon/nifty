import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IDirectory extends Resource {
  created_by: string;
  notes: string[];
  name: string;
  parent: string;
  collaborators: string[];
  is_public: boolean;
  alias?: string;
  credits?: number;
}

export type DirectoryDocument = mongoose.Document<string, object, IDirectory> & IDirectory;

export type DirectoryCreateRequest = Partial<Expand<Pick<IDirectory, 'credits' | 'alias' | 'name' | 'is_public' | 'parent'>>>

export type DirectoryListResponse = ListResponse<DirectoryDocument>