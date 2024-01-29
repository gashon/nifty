export type ListResponse<T> = {
  data: T[];
  page: number;
  has_more: boolean;
  total: number;
};
