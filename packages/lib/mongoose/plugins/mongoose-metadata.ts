import isNull from 'lodash/isNull';
import isString from 'lodash/isString';
import mapKeys from 'lodash/mapKeys';
import omit from 'lodash/omit';
import mongoose from 'mongoose';

export default function mongooseMetadata(schema: mongoose.Schema) {
  schema.add({
    metadata: {
      type: Object,
      default: {},
      validate: (v: any) => typeof v === 'object',
    },
  });

  schema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate() as null | { metadata?: any; $unset?: any };
    if (!update || !update.metadata) return;

    if (typeof update.metadata !== 'object') return;
    if (update.metadata === null) {
      this.setUpdate({ ...this.getUpdate(), metadata: {} });
      return;
    }

    this.setUpdate(omit(this.getUpdate(), 'metadata'));
    const $unset = update.$unset || {};

    mapKeys(update.metadata, (v, k) => {
      if (isString(v)) this.set(`metadata.${k}`, v);
      if (isNull(v)) $unset[`metadata.${k}`] = 1;
    });

    this.setUpdate({ ...this.getUpdate(), $unset });
  });

  schema.path('metadata').transform((v) => v || {});
}
