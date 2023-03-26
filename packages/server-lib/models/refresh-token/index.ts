import { Model } from 'mongoose';
import { REFRESH_TOKEN_EXPIRATION_IN_SECONDS } from '@nifty/common/constants';

import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import createAccessToken from './methods/create-access-token';
import { IRefreshToken, RefreshTokenDocument } from './types';

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  user: {
    type: String,
    ref: 'User',
    required: true,
    immutable: true,
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000),
  },
  created_by_ip: {
    type: String,
    required: true,
  },
  deleted_at: {
    type: Date,
    default: null,
  }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

refreshTokenSchema.methods.createAccessToken = createAccessToken;
refreshTokenSchema.plugin(mongooseObjectId('ref_tkn', 'token'));

export * from './types';
export default mongoose.models.RefreshToken as Model<RefreshTokenDocument> || mongoose.model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
