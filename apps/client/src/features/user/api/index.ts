import { useQuery } from 'react-query';
import { axios } from '@/lib/axios';

export const subscribeUser = async (email: string) => {
  return useQuery(['subscribeUser', email], async () => {
    const { data } = await axios.post('/subscribe', { email });
    return data;
  });
}