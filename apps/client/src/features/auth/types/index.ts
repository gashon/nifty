import * as z from 'zod';
import { AxiosResponse } from 'axios';
import { UseQueryResult } from 'react-query';

export type LoginFormData = {
  email: string;
};

export const LoginFormSchema = z.object({
  email: z.string().email(),
});

export type ReactQueryResponse<T> = UseQueryResult<AxiosResponse<T>, Error>;