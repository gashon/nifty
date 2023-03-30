import { inject, injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import Collaborator, { CollaboratorDocument, CollaboratorListResponse } from "@nifty/server-lib/models/collaborator";
import Directory, { DirectoryDocument } from "@nifty/server-lib/models/directory";
import Note, { NoteDocument } from "@nifty/server-lib/models/note";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { ICollaboratorService, ICollaborator } from './interfaces';
import { PaginationParams } from '@/types';

@injectable()
export class CollaboratorService implements ICollaboratorService {
  private collaboratorModel: IBaseRepository<CollaboratorDocument>;
  private directoryModel: IBaseRepository<DirectoryDocument>;
  private noteModel: IBaseRepository<NoteDocument>;

  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.collaboratorModel = repo.get<CollaboratorDocument>(Collaborator);
    this.directoryModel = repo.get<DirectoryDocument>(Directory);
    this.noteModel = repo.get<NoteDocument>(Note);
  }

  async findCollaboratorById(id: string): Promise<CollaboratorDocument | null> {
    return this.collaboratorModel.findById(id);
  }

  async findCollaboratorsByIds(ids: string[]): Promise<CollaboratorDocument[]> {
    return this.collaboratorModel.find({
      _id: {
        $in: ids
      }
    });
  }

  async findCollaboratorByDirectoryIdAndUserId(directoryId: string, userId: string): Promise<CollaboratorDocument | null> {
    const directory = await this.directoryModel.findOne({
      _id: directoryId
    });

    if (!directory) return null;
    const collaborator = await this.collaboratorModel.findOne({
      _id: directory.collaborators[0]
    });

    return collaborator;
  }

  async findCollaboratorByNoteIdAndUserId(noteId: string, userId: string): Promise<CollaboratorDocument | null> {
    const note = await this.noteModel.findOne({
      id: noteId,
    });

    if (!note) return null;
    const collaborator = await this.findCollaboratorsByIds(note.collaborators);

    // @ts-ignore
    return collaborator.find(c => c.user === userId) || null;
  }

  async paginateCollaborators(condition: FilterQuery<CollaboratorDocument>, query: PaginationParams): Promise<Partial<CollaboratorListResponse>> {
    return this.collaboratorModel.paginate({
      ...condition,
      ...query
    });
  }

  async createCollaborator(createdBy: string, data: Partial<ICollaborator>): Promise<CollaboratorDocument> {
    const doc = {
      ...data,
      created_by: createdBy,
    }
    const collaborator = await this.collaboratorModel.create(doc);
    return collaborator;
  }
}