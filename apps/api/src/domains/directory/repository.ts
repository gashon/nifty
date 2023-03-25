import { injectable } from 'inversify';
import Directory from "@nifty/server-lib/models/directory";
import { IDirectoryRepository, IDirectory } from './interfaces';

@injectable()
export class DirectoryRepository implements IDirectoryRepository {
  async findById(id: string): Promise<IDirectory | null> {
    return Directory.findById(id);
  }
}