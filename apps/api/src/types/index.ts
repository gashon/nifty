import { DB } from '@nifty/common/types';
import { OrderByExpression, SelectQueryBuilder } from 'kysely';
import { DirectedOrderByStringReference } from 'kysely/dist/cjs/parser/order-by-parser';

export type OrderBy<T extends keyof DB & string> = Extract<
  OrderByExpression<DB, T, DB[T]>,
  DirectedOrderByStringReference<DB, T, DB[T]>
>;

export type PaginationParams<T extends keyof DB> = {
  limit: number;
  cursor?: string;
  orderBy?: OrderBy<T>;
};

export type PaginationQueryParams<T extends keyof DB> = Omit<
  PaginationParams<T>,
  'limit'
> & {
  limit: string;
};
