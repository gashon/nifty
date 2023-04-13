import { axios } from '@/lib/axios';

export const getQuiz = async (id: string, headers?: { [key: string]: string }) => {
  const { data } = await axios.get(`/api/v1/quizzes/${id}`, {
    headers,
  });
  return data;
}

