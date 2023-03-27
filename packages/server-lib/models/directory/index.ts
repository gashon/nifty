import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { IDirectory, DirectoryDocument } from './types';

const directorySchema = new mongoose.Schema<IDirectory>({
  created_by: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    trim: true,
    default: "New Directory",
  },
  alias: {
    type: String,
    trim: true,
  },
  credits: {
    type: Number,
  },
  parent: {
    type: String,
    ref: "Directory",
    required: false,
    immutable: false,
  },
  collaborators: {
    type: [String],
    default: [],
    immutable: false,
    required: true,
    ref: "Collaborator",
  },
  is_public: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Number,
    default: null,
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

directorySchema.plugin(mongooseObjectId('dir', 'directory'));

directorySchema.index({ name: 1, created_by: 1 }, {});

export * from './types';
export default mongoose.models.Directory as Model<DirectoryDocument> ||
  mongoose.model<DirectoryDocument>('Directory', directorySchema);

