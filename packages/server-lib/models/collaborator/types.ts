import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { ListResponse } from '../../utils/types/tsoa/list-response';

// unix permissions
export type PermissionsType = number; // 0-7

type CollaboratorBase = {
  created_by: string;
  user: string;
  permissions: PermissionsType;
  last_viewed_at?: Date;
} & Resource;

export type ICollaborator =
  //   | {
  //       type: 'note';
  //       note: string;
  //     }
  //   | {
  //       type: 'directory';
  //       directory: string;
  //     }
  //   | { type: 'quiz'; quiz: string }
  // ) &
  {
    type: 'quiz' | 'note' | 'directory';
    directory?: string;
    quiz?: string;
    note?: string;
  } & CollaboratorBase;

export type CollaboratorModel = mongoose.Model<ICollaborator>;

export type CollaboratorCreateRequest = Partial<
  Pick<ICollaborator, 'user' | 'type' | 'permissions'>
>;

export type CollaboratorDocument = mongoose.Document<
  string,
  object,
  ICollaborator
> &
  ICollaborator;

export type CollaboratorListResponse = ListResponse<ICollaborator>;
