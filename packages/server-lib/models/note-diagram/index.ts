import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from "../../mongoose/plugins/mongoose-object-id";
import { INoteDiagram, NoteDiagramDocument } from "./types";

const noteDiagramSchema = new mongoose.Schema<INoteDiagram>({
  created_by: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  type: {
    type: String,
    enum: ["ascii"],
    required: true,
    immutable: true,
  },
  content: {
    type: String,
    required: true,
  },
  deleted_at: {
    type: Date,
    default: null,
  }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

noteDiagramSchema.plugin(mongooseObjectId("sub", "sub"));

noteDiagramSchema.index({ created_by: 1 }, {});

export * from "./types";
export default mongoose.models.NoteDiagram as Model<NoteDiagramDocument> ||
  mongoose.model<NoteDiagramDocument>("NoteDiagram", noteDiagramSchema);