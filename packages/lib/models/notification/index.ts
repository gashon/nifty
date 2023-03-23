import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import sendEmail from './middleware/send-email';
import { INotification } from './types';

const notificationSchema = new mongoose.Schema<INotification>({
  user: {
    type: String,
    ref: 'User',
    immutable: true,
    validate: (v: string) => mongoose.models.User.exists({ _id: v }),
  },
  type: {
    type: String,
    enum: ['login', 'team.invite'],
    immutable: true,
  },
  data: {
    type: Object,
    immutable: true,
    required: true,
  },
  emails: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    default: [],
    required: true,
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

notificationSchema.plugin(mongooseObjectId('ntf', 'notification'));

notificationSchema.post('save', sendEmail);

notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ type: 1, emails: 1 });
notificationSchema.index({ 'data.invoice': 1 });

export * from './types';
export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', notificationSchema);