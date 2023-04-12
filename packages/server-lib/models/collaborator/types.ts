import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { ListResponse } from '../../utils/types/tsoa/list-response';

// unix permissions 
export type PermissionsType = number; // 0-7
export type CollaboratorType = 'directory' | 'note' | 'quiz';
export interface ICollaborator extends Resource {
  created_by: string;
  user: string;
  type: CollaboratorType;
  permissions: PermissionsType;
  foreign_key?: string; // updated after foreign creation
}

export type CollaboratorCreateRequest = Partial<Pick<ICollaborator, 'user' | 'type' | 'permissions' | 'foreign_key'>>;

export type CollaboratorDocument = mongoose.Document<string, object, ICollaborator> & ICollaborator;

export type CollaboratorListResponse = ListResponse<CollaboratorDocument>