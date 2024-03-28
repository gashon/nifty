import { DB } from '@nifty/common/types';

export type OrderQueryWithTable = `${T}.${Extract<
  keyof DB[T] & string,
  string
>} ${'asc' | 'desc'}`;
export type OrderQueryWithoutTable = `${Extract<
  keyof DB[T] & string,
  string
>} ${'asc' | 'desc'}`;

export type OrderBy<T extends keyof DB & string> =
  | OrderQueryWithTable<T>
  | OrderQueryWithoutTable<T>
  | OrderQueryWithTable<T>[]
  | OrderQueryWithoutTable<T>[];

export type PaginationParams<T extends keyof DB> = {
  limit: string;
  cursor?: number;
  orderBy?: OrderBy<T>;
};
