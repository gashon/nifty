import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { PaginationParams } from "@/types";
import { ICollaborator, CollaboratorDocument, CollaboratorCreateRequest, CollaboratorListResponse, CollaboratorType } from "@nifty/server-lib/models/collaborator";
interface ICollaboratorController {

}

interface ICollaboratorService {
  findCollaboratorById(id: string): Promise<CollaboratorDocument | null>;
  findCollaboratorByForeignKey(foreignKey: string, type: CollaboratorType, userId?: string): Promise<CollaboratorDocument | null>;
  findCollaboratorByDirectoryIdAndUserId(directoryId: string, userId: string): Promise<CollaboratorDocument | null>;
  findCollaboratorByNoteIdAndUserId(noteId: string, userId: string): Promise<CollaboratorDocument | null>;
  paginateCollaborators(condition: FilterQuery<CollaboratorDocument>, query: PaginationParams): Promise<Partial<CollaboratorListResponse>>;
  createCollaborator(createdBy: string, data: CollaboratorCreateRequest): Promise<CollaboratorDocument>;
  findCollaboratorsByIds(ids: string[]): Promise<CollaboratorDocument[]>
  findCollaboratorByForeignKeyAndUserId(foreignKey: string, userId: string): Promise<CollaboratorDocument | null>;
  findCollaboratorsByType(userId: string, type: CollaboratorType): Promise<CollaboratorDocument[]>
}

export { ICollaborator, ICollaboratorController, ICollaboratorService };