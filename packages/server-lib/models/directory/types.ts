import { ObjectId } from "mongodb";

import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IDirectory extends Resource {
  created_by: ObjectId;
  notes: ObjectId[] | never[];
  name: string;
  parent: ObjectId;
  collaborators: ObjectId[] | never[];
  alias?: string;
  credits?: number;
}

export type DirectoryDocument = mongoose.Document<string, object, IDirectory> & IDirectory;

export type DirectoryCreateRequest = Partial<Expand<Pick<IDirectory, 'credits' | 'alias' | 'name' | 'parent'>>>

export type DirectoryListResponse = ListResponse<DirectoryDocument>