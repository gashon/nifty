import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { ListResponse } from '../../utils/types/tsoa/list-response';

export interface ICollaborator extends Resource {
  created_by: string;
  user: string;
  type: "directory" | "note" | "quiz";
  permissions: string[];
  foreign_key: string;
}

export type CollaboratorDocument = mongoose.Document<string, object, ICollaborator> & ICollaborator;

export type CollaboratorListResponse = ListResponse<CollaboratorDocument>