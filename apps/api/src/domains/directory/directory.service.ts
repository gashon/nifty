import { injectable } from 'inversify';
import { FilterQuery, Model } from 'mongoose';

import Directory, { DirectoryDocument, DirectoryListResponse } from "@nifty/server-lib/models/directory";
import Note, { NoteDocument } from "@nifty/server-lib/models/note";

import { IDirectoryService, IDirectory } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class DirectoryService implements IDirectoryService {
  private directoryModel: Model<DirectoryDocument>;
  private noteModel: Model<NoteDocument>;

  constructor() {
    this.directoryModel = Directory
    this.noteModel = Note
  }

  async findDirectoryById(id: string): Promise<DirectoryDocument | null> {
    return this.directoryModel.findById(id);
  }

  async findDirectoriesByCollaboratorIds(ids: string[]): Promise<DirectoryDocument[]> {
    return this.directoryModel.find({
      collaborators: {
        $in: ids
      },
      deleted_at: null
    }).sort({ created_at: -1 });
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

  async deleteDirectoryById(id: string): Promise<DirectoryDocument> {
    const directory = await this.directoryModel.findById(id);
    if (!directory) throw new Error('Directory not found');

    const notes = directory.notes;

    await Promise.all([
      this.directoryModel.updateOne({
        _id: id
      }, {
        $set: {
          deleted_at: new Date(),
        }
      }, {}),
      this.noteModel.updateMany({
        _id: {
          $in: notes
        }
      }, {
        $set: {
          deleted_at: new Date(),
        }
      }, {})
    ])

    return directory;
  }

}