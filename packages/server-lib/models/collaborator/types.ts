import { ObjectId } from "mongodb";

import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { ListResponse } from '../../utils/types/tsoa/list-response';

// unix permissions 
export type PermissionsType = number; // 0-7
export type CollaboratorType = 'directory' | 'note' | 'quiz';

type CollaboratorBase = {
  created_by: ObjectId;
  user: ObjectId;
  permissions: PermissionsType;
  foreign_key?: ObjectId; // updated after foreign creation
} & Resource;
export type ICollaborator = ({
  type: Omit<CollaboratorType, "note">;
} & CollaboratorBase) | ({
  type: "note"
  last_viewed_at?: Date;
} & CollaboratorBase)

export type CollaboratorCreateRequest = Partial<Pick<ICollaborator, 'user' | 'type' | 'permissions' | 'foreign_key'>>;

export type CollaboratorDocument = mongoose.Document<string, object, ICollaborator> & ICollaborator;

export type CollaboratorListResponse = ListResponse<CollaboratorDocument>