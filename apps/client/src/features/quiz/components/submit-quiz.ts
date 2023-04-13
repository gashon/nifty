import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { SubmissionCreateRequest } from "@nifty/server-lib/models/submission";

export const submitQuiz = async (payload: SubmissionCreateRequest) => {
  const response = await axios.post(`api/v1/quizzes/${payload.quiz_id}/submissions`, payload);
  return response.data;
}

type UseCreateSubmissionOptions = {
  config?: MutationConfig<typeof submitQuiz>;
};

export const useCreateSubmission = (quizId: string, { config }: UseCreateSubmissionOptions = {}) => {
  return useMutation({
    onMutate: async (newSubmission) => {
      await queryClient.cancelQueries(["submission", quizId]);
      return { previousModules: queryClient.getQueryData(["submission", quizId]) };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(["submission", quizId], context.previousModules);
      }
    },
    ...config,
    mutationFn: submitQuiz
  });
}