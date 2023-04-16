import { QuizListResponse, QuizCreateRequest } from '@nifty/server-lib/models/quiz';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { QuizCreateResponse } from "@nifty/api/domains/quiz/types"

export const createQuiz = (data: QuizCreateRequest): Promise<AxiosResponse<QuizCreateResponse>> => {
  return axios.post(`/api/v1/quizzes`, data);
};

type UseCreateQuizOptions = {
  config?: MutationConfig<typeof createQuiz>;
}

type InfiniteQueryData = {
  pages: QuizListResponse[];
  pageParams: Array<string | undefined>;
}

export const useCreateQuiz = ({ config }: UseCreateQuizOptions = {}) => {
  return useMutation({
    onMutate: async (newQuiz) => {
      await queryClient.cancelQueries('quizzes');

      const previousQuizzes: InfiniteQueryData = queryClient.getQueryData('quizzes');
      return { previousQuizzes };
    },
    onError: (_, __, context: any) => {
      if (context?.previousQuizzes) {
        queryClient.setQueryData('quizzes', context.previousQuizzes);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('quizzes');
    },
    ...config,
    mutationFn: createQuiz,
  });
};
