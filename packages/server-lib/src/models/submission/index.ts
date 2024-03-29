import { Model } from 'mongoose';

import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { ISubmission, SubmissionDocument, SubmissionModel } from './types';

const submissionSchema = new mongoose.Schema<ISubmission>(
  {
    created_by: {
      type: String,
      ref: 'User',
      required: true,
      immutable: true,
    },
    quiz: {
      type: String,
      ref: 'Quiz',
      required: true,
      immutable: true,
    },
    grades: {
      type: [
        {
          question_id: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ['multiple-choice', 'free-response'],
            required: true,
          },
          correct_index: {
            type: Number,
            required: false,
          },
          answer_index: {
            type: Number,
            required: false,
          },
          answer_text: {
            type: String,
            required: false,
          },
          feedback_text: {
            type: String,
            required: false,
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
    },
  },
  { timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' } }
);

submissionSchema.plugin(mongooseObjectId('sub', 'sub'));

submissionSchema.index({ created_by: 1, title: 1 }, {});

export * from './types';
export default (mongoose.models.Submission as SubmissionModel) ||
  mongoose.model<ISubmission>('Submission', submissionSchema);
