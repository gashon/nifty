import { injectable } from 'inversify';
import Directory from "@nifty/server-lib/models/directory";
import { IDirectoryRepository, IDirectory } from './interfaces';

@injectable()
export class DirectoryRepository implements IDirectoryRepository {
  async create(data: Partial<IDirectory>): Promise<IDirectory> {
    const directory = new Directory(data);
    await directory.save();
    return directory;
  }

  async findById(id: string): Promise<IDirectory | null> {
    return await Directory.findById(id).exec();
  }

  async findByName(name: string): Promise<IDirectory[]> {
    return await Directory.find({ name }).exec();
  }

  async updateById(id: string, data: Partial<IDirectory>): Promise<IDirectory | null> {
    const updatedDirectory = await Directory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updatedDirectory;
  }

  async deleteById(id: string): Promise<IDirectory | null> {
    const deletedDirectory = await Directory.findByIdAndUpdate(
      id,
      { deleted_at: Date.now() },
      { new: true }
    ).exec();
    return deletedDirectory;
  }
}