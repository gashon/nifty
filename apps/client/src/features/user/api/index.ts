import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';

export const subscribeUser = async (email: string) => {
  return axios.post('/api/v1/users/subscribe', { email });
}