import md5 from 'md5';
import mongoose from '../../mongoose';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import generateToken from './methods/generate-token';
import { IUser } from './types';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    trim: true,
    default(this: IUser) {
      return this.email;
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  avatar: {
    type: String,
    default(this: IUser) {
      return (
        this.email &&
        `https://www.gravatar.com/avatar/${md5(this.email)}?d=retro`
      );
    },
    trim: true,
  },
  last_login: {
    type: Date,
    default: null,
    get: (v?: Date) => v?.getTime() || null,
  },
  early_access: {
    type: Boolean,
    default: false,
  },
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });

userSchema.methods.generateToken = generateToken;

userSchema.plugin(mongooseObjectId('usr', 'user'));
userSchema.index({ email: 1 }, { unique: true });

export * from './types';
export default mongoose.models.User ||
  mongoose.model<IUser>('User', userSchema);
