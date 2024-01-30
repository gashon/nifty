type SortKey<T> = [keyof T, ('asc' | 'desc') | (-1 | 1)];

export type PaginationParams<T> = {
  page?: number;
  limit?: number;
  sort?: SortKey<T>[];
  expand?: string;
};
