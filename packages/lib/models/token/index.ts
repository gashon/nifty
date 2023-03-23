import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import getLoginLink from './methods/get-login-link';
import { IToken } from './types';

const tokenSchema = new mongoose.Schema<IToken>({
  user: {
    type: String,
    ref: 'User',
    required: true,
    immutable: true,
  },
  strategy: {
    type: String,
    default: 'email',
    enum: ['google', 'email', 'invite'],
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

tokenSchema.methods.getLoginLink = getLoginLink;

tokenSchema.plugin(mongooseObjectId('tkn', 'token'));

export * from './types';
export default mongoose.models.Token || mongoose.model<IToken>('Token', tokenSchema);
