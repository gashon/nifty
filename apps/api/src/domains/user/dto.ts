import type { AppResponse } from '@nifty/api/domains/dto';
import type { User, Selectable } from '@nifty/common/types';

export type GetUserRequestParam = number;
export type GetUserResponse = AppResponse<Selectable<User>>;
