import { inject, injectable } from 'inversify';
import UpdateResult, { FilterQuery } from 'mongoose';
import Collaborator, {
  CollaboratorType,
  ICollaborator,
  CollaboratorListResponse,
  CollaboratorCreateRequest,
} from '@nifty/server-lib/models/collaborator';
import Directory, { type IDirectory } from '@nifty/server-lib/models/directory';
import Note, { type INote } from '@nifty/server-lib/models/note';
import type {
  IBaseRepositoryFactory,
  IBaseRepository,
} from '../../lib/repository-base';
import type { ICollaboratorService } from './interfaces';
import type { PaginationParams } from '@/types';

@injectable()
export class CollaboratorService implements ICollaboratorService {
  private collaboratorModel: IBaseRepository<ICollaborator>;
  private directoryModel: IBaseRepository<IDirectory>;
  private noteModel: IBaseRepository<INote>;

  constructor(@inject('RepositoryGetter') repo: IBaseRepositoryFactory) {
    this.collaboratorModel = repo.get<ICollaborator>(Collaborator);
    this.directoryModel = repo.get<IDirectory>(Directory);
    this.noteModel = repo.get<INote>(Note);
  }

  async findCollaboratorById(id: string): Promise<ICollaborator | null> {
    return this.collaboratorModel.findById(id);
  }

  async findCollaboratorsByIds(ids: string[]): Promise<ICollaborator[]> {
    return this.collaboratorModel.find({
      _id: {
        $in: ids,
      },
    });
  }

  async findCollaboratorByDirectoryIdAndUserId(
    directoryId: string,
    userId: string
  ): Promise<ICollaborator | null> {
    const collaborators = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: 'directories',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'directory',
        },
      },
      {
        $unwind: {
          path: '$directory',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'directory._id': directoryId,
        },
      },
    ]);

    return collaborators[0] || null;
  }

  async findCollaboratorByNoteIdAndUserId(
    noteId: string,
    userId: string
  ): Promise<ICollaborator | null> {
    // use aggregate instead
    const collaborators = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'note',
        },
      },
      {
        $unwind: {
          path: '$note',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'note._id': noteId,
        },
      },
    ]);

    return collaborators[0] || null;
  }

  async paginateCollaborators(
    condition: FilterQuery<ICollaborator>,
    query: PaginationParams
  ): Promise<Partial<CollaboratorListResponse>> {
    return this.collaboratorModel.paginate({
      ...condition,
      ...query,
    });
  }

  async createCollaborator(
    createdBy: string,
    data: CollaboratorCreateRequest
  ): Promise<ICollaborator> {
    const doc = {
      ...data,
      created_by: createdBy,
    };
    return this.collaboratorModel.create(doc);
  }

  async findCollaboratorByForeignKeyAndUserId(
    foreignKey: string,
    userId: string
  ): Promise<ICollaborator | null> {
    return this.collaboratorModel.findOne({
      user: userId,
      foreign_key: foreignKey,
    });
  }

  async findCollaboratorByForeignKey(
    foreignKey: string,
    type: CollaboratorType,
    userId?: string
  ): Promise<ICollaborator | null> {
    return this.collaboratorModel.findOne({
      foreign_key: foreignKey,
      type,
      ...(userId && { user: userId }),
    });
  }

  async findCollaboratorsByType(
    userId: string,
    type: CollaboratorType
  ): Promise<ICollaborator[]> {
    return this.collaboratorModel.find({
      user: userId,
      type,
    });
  }
}
