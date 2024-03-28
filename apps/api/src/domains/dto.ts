import { Response } from 'express';

type PayloadResponse<T> = {
  data: T;
};

export type ExpressResponse<T> = Promise<Response<T>>;
export type AppResponse<T> = PayloadResponse<T>;
export type AppPaginationResponse<T> = PayloadResponse<T[]> & {
  pagination: {
    nextCursor: number | null;
    hasMore: boolean;
  };
};
