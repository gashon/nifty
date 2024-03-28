import { DB } from '@nifty/common/types';

export type OrderQueryWithTable<T> = `${T}.${Extract<
  keyof DB[T] & string,
  string
>} ${'asc' | 'desc'}`;
export type OrderQueryWithoutTable<T> = `${Extract<
  keyof DB[T] & string,
  string
>} ${'asc' | 'desc'}`;

export type OrderBy<T extends keyof DB & string> =
  | OrderQueryWithTable<T>
  | OrderQueryWithoutTable<T>
  | OrderQueryWithTable<T>[]
  | OrderQueryWithoutTable<T>[];

export type PaginationParams<T extends keyof DB> = {
  limit: number;
  cursor?: string;
  orderBy?: OrderBy<T>;
};
