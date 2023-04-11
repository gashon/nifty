import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from "../../mongoose/plugins/mongoose-object-id";
import { IQuiz, QuizDocument, IQuestion } from "./types";

const quizSchema = new mongoose.Schema<IQuiz>({
  created_by: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  collaborators: {
    type: [String],
    default: [],
    immutable: false,
    required: true,
    ref: "Collaborator",
  },
  note: {
    type: String,
    trim: true,
    required: true,
    ref: "Note",
  },
  questions: {
    type: [
      {
        id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ["multiple-choice"],
        },
        question: {
          type: String,
          trim: true,
          required: true,
        },
        answers: {
          type: [String],
          required: true,
        },
        correct_index: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
    immutable: false,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
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

quizSchema.plugin(mongooseObjectId("quiz", "quiz"));

quizSchema.index({ created_by: 1, title: 1 }, {});

export * from "./types";
export default mongoose.models.Quiz as Model<QuizDocument> ||
  mongoose.model<QuizDocument>("Quiz", quizSchema);