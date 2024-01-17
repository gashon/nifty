type SortKey<T> = {
  key: keyof T;
  dir: 'asc' | 'desc';
};

export type PaginationParams<T> = {
  page?: number;
  limit?: number;
  sort?: SortKey<T>[];
  expand?: string;
};
