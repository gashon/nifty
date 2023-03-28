import { inject, injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import Collaborator, { CollaboratorDocument, CollaboratorListResponse } from "@nifty/server-lib/models/collaborator";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { ICollaboratorService, ICollaborator } from './interfaces';

import { PaginationParams } from '@/types';

@injectable()
export class CollaboratorService implements ICollaboratorService {
  private collaboratorModel: IBaseRepository<CollaboratorDocument>;

  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.collaboratorModel = repo.get<CollaboratorDocument>(Collaborator);
  }

  async findCollaboratorById(id: string): Promise<CollaboratorDocument | null> {
    return this.collaboratorModel.findById(id);
  }

  async findCollaboratorByDirectoryIdAndUserId(directoryId: string, userId: string): Promise<CollaboratorDocument | null> {
    const collaborator = await this.collaboratorModel.findOne({ directory: directoryId, user: userId });
    return collaborator;
  }

  async paginateCollaborators(condition: FilterQuery<CollaboratorDocument>, query: PaginationParams): Promise<Partial<CollaboratorListResponse>> {
    return this.collaboratorModel.paginate({
      ...condition,
      ...query
    });
  }

  async createCollaborator(createdBy: string, data: Partial<ICollaborator>): Promise<CollaboratorDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
    }
    const collaborator = await this.collaboratorModel.create(doc);
    return collaborator;
  }

}