import type { AppResponse } from '@nifty/api/domains/dto';
import { PaginationParams } from '@nifty/api/types';
import type { Insertable, User, Updateable } from '@nifty/common/types';

export type GetUserRequestParam = number;
export type GetUserResponse = AppResponse<User>;
