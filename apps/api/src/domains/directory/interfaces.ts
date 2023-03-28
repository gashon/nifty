import { Request, Response } from 'express';
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
  paginateDirectories(query: PaginationParams): Promise<Partial<DirectoryListResponse>>;
}

export { IDirectory, IDirectoryController, IDirectoryService }; 