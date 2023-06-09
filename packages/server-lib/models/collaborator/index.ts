import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { ICollaborator, CollaboratorDocument, PermissionsType } from './types';

const collaboratorSchema = new mongoose.Schema<ICollaborator>({
  created_by: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  type: {
    type: String,
    required: true,
    immutable: true,
  },
  foreign_key: {
    type: String,
  },
  permissions: {
    type: Number,
    default: 0,
    immutable: false,
    required: true,
  },
  last_viewed_at: {
    type: Date,
    required: false,
  },
  deleted_at: {
    type: Date,
    default: null,
  }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

collaboratorSchema.plugin(mongooseObjectId('col', 'collaborator'));

collaboratorSchema.index({ type: 1 }, {});
collaboratorSchema.index({ user: 1 }, {});

export * from './types';
export default mongoose.models.Collaborator as Model<CollaboratorDocument> ||
  mongoose.model<CollaboratorDocument>('Collaborator', collaboratorSchema);
