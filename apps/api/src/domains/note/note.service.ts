import { inject, injectable } from 'inversify';
import { FilterQuery, Model, Query } from 'mongoose';

import Note, { NoteDocument, NoteListResponse } from "@nifty/server-lib/models/note";
import { INoteService, INote } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class NoteService implements INoteService {
  private noteModel: Model<NoteDocument>;
  constructor() {
    this.noteModel = Note
  }

  async findNoteById(id: string): Promise<NoteDocument | null> {
    return this.noteModel.findById(id);
  }

  async findNotesByIds(ids: string[]): Promise<Query<(NoteDocument & Required<{ _id: string; }>)[], NoteDocument & Required<{ _id: string; }>, {}, NoteDocument>> {
    return this.noteModel.find({
      _id: {
        $in: ids
      },
      deleted_at: null
    }).sort({ created_at: -1 });
  }

  async updateNoteById(id: string, data: Partial<INote>): Promise<Query<any, NoteDocument & Required<{ _id: string; }>, {}, NoteDocument>> {
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

  async paginateNotesByCollaboratorId(collaboratorId: string, query: PaginationParams): Promise<Partial<NoteListResponse>> {
    return this.noteModel.paginate({
      collaborators: {
        $elemMatch: {
          $eq: collaboratorId
        }
      },
      ...query
    },);

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

  async deleteNoteById(id: string): Promise<Query<any, NoteDocument & Required<{ _id: string; }>, {}, NoteDocument>> {
    return this.noteModel.updateOne(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    )
  }

  async findNoteNeighbors(noteId: string, directoryId: string, sortBy: string, limit: number): Promise<{ before: NoteDocument[], after: NoteDocument[] }> {
    const query = {
      _id: {
        $ne: noteId
      },
      directory_id: directoryId,
      deleted_at: null
    }

    const [before, after] = await Promise.all([
      this.noteModel.find(query)
        .sort({ [sortBy]: -1 })
        .limit(limit)
        .exec(),
      this.noteModel.find(query)
        .sort({ created_at: 1 })
        .limit(limit)
        .exec()
    ])

    return {
      before,
      after
    }
  }
}