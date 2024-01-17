import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { PaginationParams } from '@/types';
import {
  ICollaborator,
  CollaboratorCreateRequest,
  CollaboratorListResponse,
  CollaboratorType,
} from '@nifty/server-lib/models/collaborator';
interface ICollaboratorController {}

interface ICollaboratorService {
  findCollaboratorById(id: string): Promise<ICollaborator | null>;
  findCollaboratorByForeignKey(
    foreignKey: string,
    type: CollaboratorType,
    userId?: string
  ): Promise<ICollaborator | null>;
  findCollaboratorByDirectoryIdAndUserId(
    directoryId: string,
    userId: string
  ): Promise<ICollaborator | null>;
  findCollaboratorByNoteIdAndUserId(
    noteId: string,
    userId: string
  ): Promise<ICollaborator | null>;
  paginateCollaborators(
    condition: FilterQuery<ICollaborator>,
    query: PaginationParams
  ): Promise<Partial<CollaboratorListResponse>>;
  createCollaborator(
    createdBy: string,
    data: CollaboratorCreateRequest
  ): Promise<ICollaborator>;
  findCollaboratorsByIds(ids: string[]): Promise<ICollaborator[]>;
  findCollaboratorByForeignKeyAndUserId(
    foreignKey: string,
    userId: string
  ): Promise<ICollaborator | null>;
  findCollaboratorsByType(
    userId: string,
    type: CollaboratorType
  ): Promise<ICollaborator[]>;
}

export type { ICollaborator, ICollaboratorController, ICollaboratorService };
