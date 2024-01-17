import { Model } from 'mongoose';

import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import {
  ICollaborator,
  CollaboratorDocument,
  PermissionsType,
  CollaboratorModel,
} from './types';

const collaboratorSchema = new mongoose.Schema<ICollaborator>(
  {
    created_by: {
      type: String,
      ref: 'User',
      required: true,
      immutable: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
      immutable: true,
    },
    type: {
      type: String,
      required: true,
      immutable: true,
    },
    directory: {
      type: String,
      ref: 'Directory',
      required: false,
      default: undefined,
    },
    note: {
      type: String,
      ref: 'Note',
      required: false,
      default: undefined,
    },
    quiz: {
      type: String,
      ref: 'Quiz',
      required: false,
      default: undefined,
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
    },
  },
  { timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' } }
);

collaboratorSchema.plugin(mongooseObjectId('col', 'collaborator'));

collaboratorSchema.index({ type: 1 }, {});
collaboratorSchema.index({ user: 1 }, {});

export * from './types';
export default (mongoose.models.Collaborator as CollaboratorModel) ||
  mongoose.model<ICollaborator>('Collaborator', collaboratorSchema);
