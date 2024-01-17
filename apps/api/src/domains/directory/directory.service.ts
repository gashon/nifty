import { injectable } from 'inversify';
import { FilterQuery, Model } from 'mongoose';

import Directory, {
  IDirectory,
  DirectoryListResponse,
} from '@nifty/server-lib/models/directory';
import Note, { type INote } from '@nifty/server-lib/models/note';

import type { IDirectoryService } from './interfaces';
import type { PaginationParams } from '@/types';

@injectable()
export class DirectoryService implements IDirectoryService {
  private directoryModel: Model<IDirectory>;
  private noteModel: Model<INote>;

  constructor() {
    this.directoryModel = Directory;
    this.noteModel = Note;
  }

  async findDirectoryById(id: string): Promise<IDirectory | null> {
    return this.directoryModel.findById(id);
  }

  async findDirectoriesByCollaboratorIds(ids: string[]): Promise<IDirectory[]> {
    return this.directoryModel
      .find({
        collaborators: {
          $in: ids,
        },
        deleted_at: null,
      })
      .sort({ created_at: -1 });
  }

  async paginateDirectories(
    condition: FilterQuery<IDirectory>,
    query: PaginationParams
  ): Promise<Partial<DirectoryListResponse>> {
    return this.directoryModel.paginate({
      ...condition,
      ...query,
    });
  }

  async createDirectory(
    createdBy: string,
    data: Partial<IDirectory>
  ): Promise<IDirectory> {
    const doc = {
      created_by: createdBy,
      parent: null,
      ...data,
    };
    const directory = await this.directoryModel.create(doc);
    return directory;
  }

  async findOrCreate(
    key: Partial<IDirectory>,
    data: Partial<IDirectory>
  ): Promise<[IDirectory, boolean]> {
    const directory = await this.directoryModel.findOne(key);
    if (directory) return [directory, false];

    return [await this.directoryModel.create(data), true];
  }

  async deleteDirectoryById(id: string): Promise<IDirectory> {
    const directory = await this.directoryModel.findById(id);
    if (!directory) throw new Error('Directory not found');

    const notes = directory.notes;

    await Promise.all([
      this.directoryModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            deleted_at: new Date(),
          },
        },
        {}
      ),
      this.noteModel.updateMany(
        {
          _id: {
            $in: notes,
          },
        },
        {
          $set: {
            deleted_at: new Date(),
          },
        },
        {}
      ),
    ]);

    return directory;
  }

  async findDirectoryByNoteId(id: string): Promise<IDirectory | null> {
    return this.directoryModel.findOne({
      notes: {
        $in: [id],
      },
    });
  }

  async getKMostRecentDirectories(
    ids: string[],
    k: number
  ): Promise<IDirectory[]> {
    return this.directoryModel
      .find({
        _id: {
          $in: ids,
        },
        deleted_at: null,
      })
      .sort({ created_at: -1 })
      .limit(k);
  }
}
