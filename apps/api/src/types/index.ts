type SortKey<T> = [keyof T, 'asc' | 'desc'];

export type PaginationParams<T> = {
  page?: number;
  limit?: number;
  sort?: SortKey<T>[];
  expand?: string;
};
