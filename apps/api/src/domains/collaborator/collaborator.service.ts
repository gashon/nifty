import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import Collaborator, { CollaboratorDocument } from "@nifty/server-lib/models/collaborator";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { ICollaboratorService, ICollaborator } from './interfaces';


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

}