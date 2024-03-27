import { Response } from 'express';

type PayloadResponse<T> = {
  data: T;
};

export type ExpressResponse<T> = Promise<Response<T>>;
export type AppResponse<T> = PayloadResponse<T>;
