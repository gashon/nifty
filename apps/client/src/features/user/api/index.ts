import { axios } from '@/lib/axios';

export const subscribeUser = async (email: string) => {
  return await axios.post('/api/v1/users/subscribe', { email });
}