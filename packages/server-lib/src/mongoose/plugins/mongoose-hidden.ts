import omit from 'lodash/omit';
import mongoose from 'mongoose';

export default function mongooseHidden(schema: mongoose.Schema) {
  schema.set('toObject', {
    getters: true,
    virtuals: true,
    useProjection: true,
    transform: (_, obj) => omit(obj, ['__v', '_id']),
  });

  schema.set('toJSON', {
    getters: true,
    virtuals: true,
    useProjection: true,
    transform: (_, obj) => omit(obj, ['__v', '_id']),
  });
}
