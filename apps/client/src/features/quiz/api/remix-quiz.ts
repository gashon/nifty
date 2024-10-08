import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import type {
  CreateQuizResponse,
  CreateQuizRequestBody,
} from '@nifty/api/domains/quiz/dto';

export const remixQuiz = async (
  quizId: number,
  payload: CreateQuizRequestBody
): Promise<CreateQuizRequestBody> => {
  const { data } = await axios.post(`/api/v1/quizzes/${quizId}/remix`, payload);

  return data;
};

type UseCreateQuizOptions = {
  config?: MutationConfig<typeof remixQuiz>;
};

type InfiniteQueryData = {
  pages: CreateQuizResponse[];
  pageParams: Array<string | undefined>;
};

export const useRemixQuiz = (
  quizId: number,
  { config }: UseCreateQuizOptions = {}
) => {
  return useMutation({
    onMutate: async (newQuiz) => {
      await queryClient.cancelQueries(['remix', quizId]);

      const previousQuizzes: InfiniteQueryData = queryClient.getQueryData([
        'remix',
        quizId,
      ]);
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
    mutationFn: (payload: any) => remixQuiz(quizId, payload),
  });
};
