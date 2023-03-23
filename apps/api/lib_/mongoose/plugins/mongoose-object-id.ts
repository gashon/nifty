import mongoose from 'mongoose';
import generateId from '../../helpers/generate-id';

export default function mongooseObjectId(prefix: string, objectName: string) {
  return function (schema: mongoose.Schema) {
    schema.add({
      _id: {
        type: String,
        default: () => generateId(prefix),
      },
    });

    schema.virtual('object').get(() => objectName);
  };
}
