import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { IDirectory, DirectoryDocument, DirectoryListResponse } from "@nifty/server-lib/models/directory";
import { DirectoryCreateResponse } from "@/domains/directory/types";
import { PaginationParams } from "@/types";
interface IDirectoryController {
  getDirectory(req: Request, res: Response): Promise<void>;
  createDirectory(req: Request, res: Response): Promise<Response<DirectoryCreateResponse>>
  getDirectories(req: Request, res: Response): Promise<void>;
}

interface IDirectoryService {
  findDirectoryById(id: string): Promise<DirectoryDocument | null>;
  createDirectory(createdBy: string, data: Partial<IDirectory>): Promise<DirectoryDocument>;
  paginateDirectories(condition: FilterQuery<DirectoryDocument>, query: PaginationParams): Promise<Partial<DirectoryListResponse>>;
  findDirectoriesByCollaboratorIds(ids: string[]): Promise<DirectoryDocument[]>;
  deleteDirectoryById(id: string): Promise<DirectoryDocument>;
}

export { IDirectory, IDirectoryController, IDirectoryService }; 