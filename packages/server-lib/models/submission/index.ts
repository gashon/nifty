import { Model } from "mongoose";

import mongoose from "../../mongoose";
import mongooseObjectId from "../../mongoose/plugins/mongoose-object-id";
import { ISubmission, SubmissionDocument } from "./types";

const submissionSchema = new mongoose.Schema<ISubmission>({
  created_by: {
    type: String,
    ref: "User",
    required: true,
    immutable: true,
  },
  quiz: {
    type: String,
    ref: "Quiz",
    required: true,
    immutable: true,
  },
  answers: {
    type: [
      {
        question_id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        correct_index: {
          type: Number,
          required: true,
        },
        answer_index: {
          type: Number,
          required: true,
        },
        is_correct: {
          type: Boolean,
          required: true,
        },
      },
    ],
    required: true,
  },
  total_questions: {
    type: Number,
    required: true,
  },
  total_correct: {
    type: Number,
    required: true,
  },
  total_incorrect: {
    type: Number,
    required: true,
  },
  total_unanswered: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  time_taken: {
    type: Number,
    required: true,
  },
  deleted_at: {
    type: Date,
    default: null,
  }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

submissionSchema.plugin(mongooseObjectId("sub", "sub"));

submissionSchema.index({ created_by: 1, title: 1 }, {});

export * from "./types";
export default mongoose.models.Submission as Model<SubmissionDocument> ||
  mongoose.model<SubmissionDocument>("Submission", submissionSchema);