import { Request, Response } from 'express';
import { IDirectory, DirectoryDocument } from "@nifty/server-lib/models/directory";
import { DirectoryCreateResponse } from "@/domains/directory/types";
interface IDirectoryController {
  getDirectory(req: Request, res: Response): Promise<void>;
  createDirectory(req: Request, res: Response): Promise<Response<DirectoryCreateResponse>>
}

interface IDirectoryService {
  findDirectoryById(id: string): Promise<DirectoryDocument | null>;
  createDirectory(createdBy: string, data: Partial<IDirectory>): Promise<DirectoryDocument>;
}

export { IDirectory, IDirectoryController, IDirectoryService }; 