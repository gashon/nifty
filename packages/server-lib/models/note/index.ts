import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from "../../mongoose/plugins/mongoose-object-id";
import { INote, NoteDocument } from "./types";

const noteSchema = new mongoose.Schema<INote>({
  created_by: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  title: {
    type: String,
    trim: true,
    default: "New Note",
  },
  content: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    trim: true,
    required: false,
    sparse: true,
    default: "",
  },
  collaborators: {
    type: [String],
    default: [],
    immutable: false,
    required: true,
    ref: "Collaborator",
  },
  directory: {
    type: String,
    trim: true,
    ref: "Directory",
    required: false,
    immutable: false,
  },
  img_url: {
    type: String,
    trim: true,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  is_public: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Number,
    default: null,
  }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

noteSchema.plugin(mongooseObjectId("note", "note"));

noteSchema.index({ created_by: 1, title: 1 }, { unique: true });

export * from "./types";
export default mongoose.models.Note as Model<NoteDocument> ||
  mongoose.model<NoteDocument>("Note", noteSchema);