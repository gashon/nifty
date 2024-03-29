import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import type {
  GetQuizzesRequestQuery,
  GetQuizzesResponse,
} from '@nifty/api/domains/quiz/dto';
import { axios } from '@nifty/client/lib/axios';

export const getQuizzes = async (
  params: GetQuizzesRequestQuery
): Promise<GetQuizzesResponse> => {
  const { data } = await axios.get(`/api/v1/quizzes`, {
    params,
  });
  return data;
};

type UseQuizzesOptions = GetQuizzesRequestQuery;

export const useInfiniteQuizzes = ({
  ...pagination
}: UseQuizzesOptions): UseInfiniteQueryResult<UseQuizzesOptions> => {
  return useInfiniteQuery({
    queryKey: ['quizzes'],
    queryFn: ({ pageParam = undefined }) =>
      getQuizzes({ ...pagination, cursor: pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.nextCursor;
      }
    },
  });
};
