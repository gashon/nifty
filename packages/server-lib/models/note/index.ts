import { Model } from 'mongoose';

import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { INote, NoteDocument, NoteModel } from './types';

const noteSchema = new mongoose.Schema<INote>(
  {
    created_by: {
      type: String,
      ref: 'User',
      required: true,
      immutable: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'New Note',
    },
    content: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      required: false,
      sparse: true,
      default: '',
    },
    collaborators: {
      type: [String],
      default: [],
      immutable: false,
      required: true,
      ref: 'Collaborator',
    },
    img_url: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    public_permissions: {
      type: Number,
      default: 0,
      immutable: false,
      required: true,
    },
    deleted_at: {
      type: Number,
      default: null,
    },
  },
  { timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' } }
);

noteSchema.plugin(mongooseObjectId('note', 'note'));

noteSchema.index({ created_by: 1, title: 1 }, {});

export * from './types';
export default (mongoose.models.Note as NoteModel) ||
  mongoose.model<INote>('Note', noteSchema);
