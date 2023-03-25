import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';

export interface ICollaborator extends Resource {
  user: mongoose.Types.ObjectId;
  directory: mongoose.Types.ObjectId;
  note: mongoose.Types.ObjectId;
  permissions: string[];
  removed_at: number;
}

export type CollaboratorDocument = mongoose.Document<string, object, ICollaborator>;
