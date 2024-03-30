import { axios } from '@nifty/client/lib/axios';
import type {
  GetQuizByIdResponse,
  GetQuizSubmissionByIdResponse,
} from '@nifty/api/domains/quiz/dto';

export const getQuiz = async (
  id: string,
  headers?: { [key: string]: string }
): Promise<GetQuizByIdResponse> => {
  const { data } = await axios.get(`/api/v1/quizzes/${id}`, {
    headers,
  });
  return data;
};

export const getQuizSubmission = async (
  submissionId: string,
  headers?: { [key: string]: string }
): Promise<GetQuizSubmissionByIdResponse> => {
  const { data } = await axios.get(
    `/api/v1/quizzes/submissions/${submissionId}`,
    {
      headers,
    }
  );
  return data;
};
