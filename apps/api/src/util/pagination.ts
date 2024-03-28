import { DB, SelectQueryBuilder } from '@nifty/common/types';
import { AppPaginationResponse } from '../domains/dto';

export const getPaginationMeta = <T extends { id: number }>(
  items: T[],
  limit: number | string
): AppPaginationResponse<T>['pagination'] => {
  const hasMore = items.length === Number(limit);
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return {
    nextCursor,
    hasMore,
  };
};
