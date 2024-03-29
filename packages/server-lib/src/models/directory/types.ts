import { PaginateMethod } from '../..//mongoose/plugins/mongoose-paginate';
import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface IDirectory extends Resource {
  created_by: string;
  notes: string[];
  name: string;
  parent: string;
  collaborators: string[];
  alias?: string;
  credits?: number;
}

export type DirectoryDocument = mongoose.Document<string, object, IDirectory> &
  IDirectory;

type DirectoryStaticMethods = PaginateMethod<IDirectory>;

export type DirectoryModel = mongoose.Model<IDirectory> &
  DirectoryStaticMethods;

export type DirectoryCreateRequest = Partial<
  Expand<Pick<IDirectory, 'credits' | 'alias' | 'name' | 'parent'>>
>;

export type DirectoryListResponse = ListResponse<IDirectory>;
