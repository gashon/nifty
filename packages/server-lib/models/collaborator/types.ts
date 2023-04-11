import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export type PermissionsType = 'r' | 'w' | 'd'; // read, write, delete
export interface ICollaborator extends Resource {
  created_by: string;
  user: string;
  type: "directory" | "note" | "quiz";
  permissions: PermissionsType[];
  foreign_key?: string;
}

export type CollaboratorCreateRequest = Partial<Pick<ICollaborator, 'user' | 'type' | 'permissions' | 'foreign_key'>>;

export type CollaboratorDocument = mongoose.Document<string, object, ICollaborator> & ICollaborator;

export type CollaboratorListResponse = ListResponse<CollaboratorDocument>