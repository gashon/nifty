import { inject, injectable } from 'inversify';
import UpdateResult, { FilterQuery, } from 'mongoose';
import Collaborator, { CollaboratorType, CollaboratorDocument, CollaboratorListResponse, CollaboratorCreateRequest } from "@nifty/server-lib/models/collaborator";
import Directory, { DirectoryDocument } from "@nifty/server-lib/models/directory";
import Note, { NoteDocument } from "@nifty/server-lib/models/note";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { ICollaboratorService, ICollaborator } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class CollaboratorService implements ICollaboratorService {
  private collaboratorModel: IBaseRepository<CollaboratorDocument>;
  private directoryModel: IBaseRepository<DirectoryDocument>;
  private noteModel: IBaseRepository<NoteDocument>;

  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.collaboratorModel = repo.get<CollaboratorDocument>(Collaborator);
    this.directoryModel = repo.get<DirectoryDocument>(Directory);
    this.noteModel = repo.get<NoteDocument>(Note);
  }

  async findCollaboratorById(id: string): Promise<CollaboratorDocument | null> {
    return this.collaboratorModel.findById(id);
  }

  async findCollaboratorsByIds(ids: string[]): Promise<CollaboratorDocument[]> {
    return this.collaboratorModel.find({
      _id: {
        $in: ids
      }
    });
  }

  async findCollaboratorByDirectoryIdAndUserId(directoryId: string, userId: string): Promise<CollaboratorDocument | null> {

    const collaborators = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        }
      },
      {
        $lookup: {
          from: 'directories',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'directory'
        }
      },
      {
        $unwind: {
          path: '$directory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'directory._id': directoryId
        }
      }
    ]);

    return collaborators[0] || null;
  }

  async findCollaboratorByNoteIdAndUserId(noteId: string, userId: string): Promise<CollaboratorDocument | null> {

    // use aggregate instead
    const collaborators = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        }
      },
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'note'
        }
      },
      {
        $unwind: {
          path: '$note',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'note._id': noteId
        }
      }
    ]);

    return collaborators[0] || null;
  }

  async paginateCollaborators(condition: FilterQuery<CollaboratorDocument>, query: PaginationParams): Promise<Partial<CollaboratorListResponse>> {
    return this.collaboratorModel.paginate({
      ...condition,
      ...query
    });
  }

  async createCollaborator(createdBy: string, data: CollaboratorCreateRequest): Promise<CollaboratorDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
    }
    return this.collaboratorModel.create(doc);
  }

  async findCollaboratorByForeignKeyAndUserId(foreignKey: string, userId: string): Promise<CollaboratorDocument | null> {
    return this.collaboratorModel.findOne({
      user: userId,
      foreign_key: foreignKey
    })
  }

  async findCollaboratorByForeignKey(foreignKey: string, type: CollaboratorType, userId?: string): Promise<CollaboratorDocument | null> {
    return this.collaboratorModel.findOne({
      foreign_key: foreignKey,
      type,
      ...(userId && { user: userId })
    });

  }
}