import type {
  AppPaginationResponse,
  AppResponse,
} from '@nifty/api/domains/dto';
import type { PaginationQueryParams } from '@nifty/api/types';
import type { Insertable, Directory, Selectable } from '@nifty/common/types';

export type GetDirectoryRequestParam = Pick<Selectable<Directory>, 'id'>;
export type GetDirectoryResponse = AppResponse<Selectable<Directory>>;

export type GetDirectoriesRequestQuery = PaginationQueryParams<'directory'>;
export type GetDirectoriesResponse = AppPaginationResponse<
  Selectable<Directory>
>;

export type CreateDirectoryRequestBody = Pick<
  Insertable<Directory>,
  'alias' | 'name' | 'credits' | 'parentId'
>;
export type CreateDirectoryResponse = AppResponse<Selectable<Directory>>;

export type DeleteDirectoryRequestParam = number;
export type DeleteDirectoryResponse = AppResponse<{
  id: Pick<Selectable<Directory>, 'id'>;
}>;
