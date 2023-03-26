import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { IDirectory, DirectoryDocument } from './types';

const directorySchema = new mongoose.Schema<IDirectory>({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    trim: true,
    default: "Directory Name",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directory",
    required: false,
    immutable: false,
  },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
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

directorySchema.index({ created_by: 1, name: 1 }, { unique: true });

export * from './types';
export default mongoose.models.Directory as Model<DirectoryDocument> ||
  mongoose.model<DirectoryDocument>('Directory', directorySchema);

