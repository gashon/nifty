import { useMutation } from 'react-query';

import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import type {
  CreateQuizResponse,
  CreateQuizRequestBody,
  GetQuizzesResponse,
} from '@nifty/api/domains/quiz/dto';

export const createQuiz = async (
  payload: CreateQuizRequestBody
): Promise<CreateQuizResponse> => {
  const { data } = await axios.post(`/api/v1/quizzes`, payload);

  return data;
};

type UseCreateQuizOptions = {
  config?: MutationConfig<typeof createQuiz>;
};

type InfiniteQueryData = {
  pages: GetQuizzesResponse[];
  pageParams: Array<string | undefined>;
};

export const useCreateQuiz = ({ config }: UseCreateQuizOptions = {}) => {
  return useMutation({
    onMutate: async (newQuiz) => {
      await queryClient.cancelQueries('quizzes');

      const previousQuizzes: InfiniteQueryData =
        queryClient.getQueryData('quizzes');
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
