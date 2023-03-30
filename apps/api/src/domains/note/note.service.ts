import { inject, injectable } from 'inversify';
import { FilterQuery } from 'mongoose';

import Note, { NoteDocument, NoteListResponse } from "@nifty/server-lib/models/note";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { INoteService, INote } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class NoteService implements INoteService {
  private noteModel: IBaseRepository<NoteDocument>;
  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.noteModel = repo.get<NoteDocument>(Note);
  }

  async findNoteById(id: string): Promise<NoteDocument | null> {
    return this.noteModel.findById(id);
  }

  findNotesByIds(ids: string[]): Promise<NoteDocument[]> {
    return this.noteModel.find({
      _id: {
        $in: ids
      }
    }).sort({ created_at: -1 })
  }

  updateNoteById(id: string, data: Partial<INote>): Promise<NoteDocument> {
    return this.noteModel.updateOne({
      _id: id
    }, {
      $set: data
    }, {})
  }

  async paginateNotes(condition: FilterQuery<NoteDocument>, query: PaginationParams): Promise<Partial<NoteListResponse>> {
    return this.noteModel.paginate({
      ...condition,
      ...query
    });
  }

  async createNote(createdBy: string, data: Partial<INote>): Promise<NoteDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
      parent: null,
      collaborators: [createdBy],
    }
    const note = await this.noteModel.create(doc);
    return note;
  }

  async findOrCreate(key: Partial<INote>, data: Partial<INote>): Promise<[NoteDocument, boolean]> {
    const note = await this.noteModel.findOne(key);
    if (note) return [note, false];

    return [await this.noteModel.create(data), true];
  }
}