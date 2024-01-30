import { Query } from '@nifty/server-lib/mongoose/plugins/mongoose-paginate';

export type PaginationParams<T> = Pick<
  Query<T>,
  'limit' | 'page' | 'sort' | 'expand'
>;
