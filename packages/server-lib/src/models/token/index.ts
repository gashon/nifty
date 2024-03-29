import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS } from '@nifty/common/constants';

import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import { IToken, TokenModel } from './types';

const tokenSchema = new mongoose.Schema<IToken>(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
      immutable: true,
    },
    strategy: {
      type: String,
      default: 'email',
      enum: ['google', 'email', 'invite', 'refresh', 'github'],
    },
    expires_at: {
      type: Date,
      default: () =>
        new Date(Date.now() + ACCESS_TOKEN_EXPIRATION_IN_SECONDS * 1000),
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' } }
);

tokenSchema.plugin(mongooseObjectId('tkn', 'token'));

export * from './types';
export default (mongoose.models.Token as TokenModel) ||
  mongoose.model<IToken>('Token', tokenSchema);
