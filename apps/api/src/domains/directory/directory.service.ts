import { inject, injectable } from 'inversify';
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

  async paginateDirectories(query: PaginationParams): Promise<Partial<DirectoryListResponse>> {
    return this.directoryModel.paginate(query);
  }

  async createDirectory(createdBy: string, data: Partial<IDirectory>): Promise<DirectoryDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
      parent: null,
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