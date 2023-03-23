import { AxiosResponse } from 'axios';
import { UseQueryResult } from 'react-query';

export type LoginFormData = {
  email: string;
};

export type ReactQueryResponse<T> = UseQueryResult<AxiosResponse<T>, Error>;
