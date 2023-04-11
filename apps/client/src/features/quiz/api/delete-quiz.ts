import { QuizListResponse } from '@nifty/server-lib/models/quiz';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';

export const deleteQuiz = (quizId: string) => {
  return axios.delete(`/api/v1/quizzes/${quizId}`);
};

type UseCreateQuizOptions = {
  config?: MutationConfig<typeof deleteQuiz>;
};

export const useDeleteQuiz = ({ config }: UseCreateQuizOptions = {}) => {
  return useMutation({
    onMutate: async (deleteQuiz) => {
      await queryClient.cancelQueries('quizzes');

      // delete the quiz from the cache
      const previousQuizzes: QuizListResponse = queryClient.getQueryData('quizzes');
      queryClient.setQueryData('quizzes', () => (
        {
          ...previousQuizzes,
          data: (previousQuizzes?.data || []).filter((dir) => dir.id !== deleteQuiz.id),
        }
      ));

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
