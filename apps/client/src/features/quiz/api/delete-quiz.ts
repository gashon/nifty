import { useMutation } from 'react-query';

import {
  DeleteQuizByIdResponse,
  DeleteQuizByIdRequestParams,
  GetQuizzesResponse,
} from '@nifty/api/domains/quiz/dto';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';

export const deleteQuiz = (quizId: DeleteQuizByIdRequestParams) => {
  return axios.delete(`/api/v1/quizzes/${quizId}`);
};

type UseCreateQuizOptions = {
  config?: MutationConfig<typeof deleteQuiz>;
};

export const useDeleteQuiz = ({ config }: UseCreateQuizOptions = {}) => {
  return useMutation({
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries('quizzes');

      // delete the quiz from the cache
      const previousQuizzes =
        queryClient.getQueryData<GetQuizzesResponse>('quizzes');
      queryClient.setQueryData('quizzes', () => ({
        ...previousQuizzes,
        data: (previousQuizzes?.data || []).filter(
          (dir) => dir.id !== deletedId
        ),
      }));

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
    mutationFn: (quizId) => deleteQuiz(quizId),
  });
};
