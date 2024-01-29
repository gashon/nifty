import omit from 'lodash/omit';
import mongoose from 'mongoose';
import parseJSON from '../../helpers/parse-json';

interface Metadata {
  total: number;
  page: number;
  has_more?: boolean;
}

export default function mongoosePaginate(schema: mongoose.Schema) {
  schema.statics.paginate = function paginate(query = {}, options) {
    options = {
      projection: {},
      sort: { created_at: -1 },
      select: '',
      ...options,
    };

    if (query.limit) options.limit = query.limit;
    if (query.page) options.page = query.page;
    if (query.sort) options.sort = query.sort;
    if (query.expand)
      options.expand = query.expand.map((i: string) => parseJSON(i));

    query = omit(query, ['page', 'limit', 'sort', 'expand']);

    const limit =
      +options.limit > 0 ? (+options.limit <= 100 ? +options.limit : 100) : 20;
    const page = +options.page > 0 ? +options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(query).exec();

    const result = this.find(query, options.projection);

    if (options.expand) result.populate(options.expand);

    const docsPromise = result
      .where('deleted_at')
      .equals(null)
      .select(options.select)
      .skip(skip)
      .limit(limit)
      .sort(options.sort)
      .exec();

    return Promise.all([countPromise, docsPromise])
      .then((values) => {
        const [total, data] = values;
        const meta: Metadata = { total, page };

        const pages = limit > 0 ? Math.ceil(total / limit) || 1 : 0;
        meta.has_more = page < pages;

        const value = { data, ...meta };

        return Promise.resolve(value);
      })
      .catch((error) => Promise.reject(error));
  };
}
