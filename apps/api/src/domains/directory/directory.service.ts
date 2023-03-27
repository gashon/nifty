import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import Directory, { DirectoryDocument } from "@nifty/server-lib/models/directory";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { IDirectoryService, IDirectory } from './interfaces';

@injectable()
export class DirectoryService implements IDirectoryService {
  private directoryModel: IBaseRepository<DirectoryDocument>;
  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.directoryModel = repo.get<DirectoryDocument>(Directory);
  }

  async getMe(accessToken: string): Promise<DirectoryDocument | null> {
    // todo implement this (get token repository)
    // const token = await Token.findById(req.cookies.access_token).populate('directory');
    // if (!token) return res.sendStatus(status.UNAUTHORIZED);

    // res.send(token.directory);
    return null;
  }

  async findDirectoryById(id: string): Promise<DirectoryDocument | null> {
    return this.directoryModel.findById(id);
  }

  async createDirectory(createdBy: string, data: Partial<IDirectory>): Promise<DirectoryDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
      parent: null,
    }
    const directory = await this.directoryModel.create(Directory);
    return directory;
  }

  async findOrCreate(key: Partial<IDirectory>, data: Partial<IDirectory>): Promise<[DirectoryDocument, boolean]> {
    const directory = await this.directoryModel.findOne(key);
    if (directory) return [directory, false];

    return [await this.directoryModel.create(data), true];
  }
}