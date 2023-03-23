import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import createAccessToken from './methods/create-access-token';
import { IRefreshToken } from './types';

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  user: {
    type: String,
    ref: 'User',
    required: true,
    immutable: true,
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days
  },
  created_by_ip: {
    type: String,
    required: true,
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

refreshTokenSchema.methods.createAccessToken = createAccessToken;
refreshTokenSchema.plugin(mongooseObjectId('ref_tkn', 'token'));

export * from './types';
export default mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
