import { QuizListResponse, QuizCreateRequest } from '@nifty/server-lib/models/quiz';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import { QuizCreateResponse } from "@nifty/api/domains/quiz/types"

export const remixQuiz = (quizId, data: QuizCreateRequest): Promise<AxiosResponse<QuizCreateResponse>> => {
  return axios.post(`/api/v1/quizzes/${quizId}/remix`, data);
};

type UseCreateQuizOptions = {
  config?: MutationConfig<typeof remixQuiz>;
}

type InfiniteQueryData = {
  pages: QuizListResponse[];
  pageParams: Array<string | undefined>;
}

export const useRemixQuiz = (quizId: string, { config }: UseCreateQuizOptions = {}) => {
  return useMutation({
    onMutate: async (newQuiz) => {
      await queryClient.cancelQueries(['remix', quizId]);

      const previousQuizzes: InfiniteQueryData = queryClient.getQueryData(['remix', quizId]);
      return { previousQuizzes };
    },
    onError: (_, __, context: any) => {
      if (context?.previousQuizzes) {
        queryClient.setQueryData(['remix', quizId], context.previousQuizzes);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['remix', quizId]);
    },
    ...config,
    mutationFn: (payload: any) => remixQuiz(quizId, payload)
  });
};
