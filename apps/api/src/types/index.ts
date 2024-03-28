import { DB } from '@nifty/common/types';

export type OrderBy<T extends keyof DB & string> =
  | `${T}.${Extract<keyof DB[T] & string, string>} ${'asc' | 'desc'}`
  | `${Extract<keyof DB[T] & string, string>} ${'asc' | 'desc'}`;

export type PaginationParams<T extends keyof DB> = {
  limit: string;
  cursor?: string;
  orderBy?: OrderBy<T>[];
};
