import mongoose from 'mongoose';
import qs from 'qs';

mongoose.set('strictPopulate', false);

export default function mongooseExpand(schema: mongoose.Schema) {
  function populate(
    this: mongoose.Query<mongoose.Document, mongoose.Document>
  ) {
    const { expand } = this.getQuery();

    if (expand === undefined) return;

    const parsedExpand =
      Object.keys(qs.parse(expand))[0] === '0'
        ? Object.values(qs.parse(expand))
        : qs.parse(expand);

    this.populate(parsedExpand as string[]);
    this.setQuery({ ...this.getQuery(), expand: undefined });
  }

  schema.pre('find', populate);
  schema.pre('findOne', populate);
}
