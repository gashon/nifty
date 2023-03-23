import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS } from 'common/constants';

import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
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
    default: () => new Date(Date.now() + ACCESS_TOKEN_EXPIRATION_IN_SECONDS * 1000),
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

tokenSchema.plugin(mongooseObjectId('tkn', 'token'));

export * from './types';
export default mongoose.models.Token || mongoose.model<IToken>('Token', tokenSchema);
