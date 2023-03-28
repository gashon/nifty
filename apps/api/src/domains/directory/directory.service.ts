import { inject, injectable } from 'inversify';
import { FilterQuery } from 'mongoose';

import Directory, { DirectoryDocument, DirectoryListResponse } from "@nifty/server-lib/models/directory";

import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { IDirectoryService, IDirectory } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class DirectoryService implements IDirectoryService {
  private directoryModel: IBaseRepository<DirectoryDocument>;

  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.directoryModel = repo.get<DirectoryDocument>(Directory);
  }

  async findDirectoryById(id: string): Promise<DirectoryDocument | null> {
    return this.directoryModel.findById(id);
  }

  async findDirectoriesByCollaboratorIds(ids: string[]): Promise<DirectoryDocument[]> {
    return this.directoryModel.find({
      collaborators: {
        $in: ids
      }
    });
  }

  async paginateDirectories(condition: FilterQuery<DirectoryDocument>, query: PaginationParams): Promise<Partial<DirectoryListResponse>> {
    return this.directoryModel.paginate({
      ...condition,
      ...query
    });
  }

  async createDirectory(createdBy: string, data: Partial<IDirectory>): Promise<DirectoryDocument> {
    const doc = {
      created_by: createdBy,
      parent: null,
      ...data,
    }
    const directory = await this.directoryModel.create(doc);
    return directory;
  }

  async findOrCreate(key: Partial<IDirectory>, data: Partial<IDirectory>): Promise<[DirectoryDocument, boolean]> {
    const directory = await this.directoryModel.findOne(key);
    if (directory) return [directory, false];

    return [await this.directoryModel.create(data), true];
  }

}