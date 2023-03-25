import { inject, injectable } from 'inversify';
import { IDirectoryService, IDirectoryRepository, IDirectory } from './interfaces';

@injectable()
export class DirectoryService implements IDirectoryService {
  constructor(
    @inject('DirectoryRepository') private directoryRepository: IDirectoryRepository,
  ) { }

  async getUserById(id: string): Promise<IDirectory | null> {
    return this.directoryRepository.findById(id);
  }
}