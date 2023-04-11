import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { QuizListResponse } from '@nifty/server-lib/models/quiz';
import { PaginationParams } from '@nifty/api/types';
import { axios } from '@/lib/axios';

export const getQuizzes = async ({ sort, limit, page, expand }: PaginationParams): Promise<QuizListResponse> => {
  const { data } = await axios.get(`/api/v1/quizzes`, {
    params: {
      sort,
      limit,
      page,
      expand
    },
  });
  return data;
};

type UseQuizzesOptions = PaginationParams;

export const useInfiniteQuizzes = ({ ...pagination }: UseQuizzesOptions): UseInfiniteQueryResult<PaginationParams> => {
  return useInfiniteQuery({
    queryKey: ['quizzes'],
    queryFn: ({ pageParam = 1 }) => getQuizzes({ ...pagination, page: pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.has_more) {
        return lastPage.page + 1;
      }
    },
  });
};

