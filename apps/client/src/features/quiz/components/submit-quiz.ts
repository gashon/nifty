import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import type {
  CreateQuizSubmissionResponse,
  CreateQuizSubmissionRequestBody,
} from '@nifty/api/domains/quiz/dto';

export const submitQuiz = async (payload: CreateQuizSubmissionRequestBody) => {
  const response = await axios.post(
    `api/v1/quizzes/${payload.quizId}/submissions`,
    payload
  );
  return response.data;
};

type UseCreateSubmissionOptions = {
  config?: MutationConfig<typeof submitQuiz>;
};

export const useCreateSubmission = (
  quizId: string,
  { config }: UseCreateSubmissionOptions = {}
) => {
  return useMutation({
    onMutate: async (newSubmission) => {
      await queryClient.cancelQueries(['submission', quizId]);
      return {
        previousModules: queryClient.getQueryData(['submission', quizId]),
      };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(
          ['submission', quizId],
          context.previousModules
        );
      }
    },
    ...config,
    mutationFn: submitQuiz,
  });
};
