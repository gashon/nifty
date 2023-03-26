import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { ICollaborator, CollaboratorDocument } from './types';

const collaboratorSchema = new mongoose.Schema<ICollaborator>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  directory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directory",
    required: false,
    immutable: true,
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: false,
    immutable: true,
  },
  permissions: {
    type: [String],
    default: [],
    immutable: false,
    required: true,
    enum: ["read", "write", "delete"],
  },
  removed_at: {
    type: Number,
    default: null,
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

collaboratorSchema.plugin(mongooseObjectId('col', 'collaborator'));

collaboratorSchema.index({ user: 1, note: 1 }, { unique: true });

export * from './types';
export default mongoose.models.Collaborator as Model<CollaboratorDocument> ||
  mongoose.model<CollaboratorDocument>('Collaborator', collaboratorSchema);
