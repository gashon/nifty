import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import {
  IDirectory,
  DirectoryListResponse,
} from '@nifty/server-lib/models/directory';
import { DirectoryCreateResponse } from '@/domains/directory/types';
import { PaginationParams } from '@/types';
interface IDirectoryController {
  getDirectory(req: Request, res: Response): Promise<void>;
  createDirectory(
    req: Request,
    res: Response
  ): Promise<Response<DirectoryCreateResponse>>;
  getDirectories(req: Request, res: Response): Promise<void>;
}

interface IDirectoryService {
  findDirectoryById(id: string): Promise<IDirectory | null>;
  createDirectory(
    createdBy: string,
    data: Partial<IDirectory>
  ): Promise<IDirectory>;
  paginateDirectories(
    condition: FilterQuery<IDirectory>,
    query: PaginationParams
  ): Promise<Partial<DirectoryListResponse>>;
  findDirectoriesByCollaboratorIds(ids: string[]): Promise<IDirectory[]>;
  deleteDirectoryById(id: string): Promise<IDirectory>;
  findDirectoryByNoteId(id: string): Promise<IDirectory | null>;
  getKMostRecentDirectories(ids: string[], k: number): Promise<IDirectory[]>;
}

export type { IDirectory, IDirectoryController, IDirectoryService };
