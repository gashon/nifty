import randomstring from 'randomstring';
import mongoose from '../../mongoose';
import mongooseCreated from '../../mongoose/plugins/mongoose-created';
import mongooseObjectId from '../../mongoose/plugins/mongoose-object-id';
import roll from './methods/roll';
import { IApiKey } from './types';

const apiKeySchema = new mongoose.Schema<IApiKey>({
  user: {
    type: String,
    ref: 'User',
    immutable: true,
    validate: (v: string) => mongoose.models.User.exists({ _id: v }),
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    default(this: IApiKey) {
      return `sk_${this.test ? 'test' : 'live'}_${randomstring.generate(64)}`;
    },
  },
  last_used: {
    type: Date,
    default: null,
    get: (v?: Date) => v?.getTime() || null,
  },
});

apiKeySchema.methods.roll = roll;

apiKeySchema.plugin(mongooseObjectId('ak', 'api_key'));
apiKeySchema.plugin(mongooseCreated);

apiKeySchema.index({ key: 1 });

export * from './types';
export default mongoose.models.ApiKey ||
  mongoose.model<IApiKey>('ApiKey', apiKeySchema);
