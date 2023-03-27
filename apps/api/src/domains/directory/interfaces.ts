import { Request, Response } from 'express';
import { IDirectory, DirectoryDocument } from "@nifty/server-lib/models/directory";
interface IDirectoryController {
  getDirectory(req: Request, res: Response): Promise<void>;
  createDirectory(req: Request, res: Response): Promise<void>;
}

interface IDirectoryService {
  findDirectoryById(id: string): Promise<DirectoryDocument | null>;
  createDirectory(createdBy: string, data: Partial<IDirectory>): Promise<DirectoryDocument>;
}

export { IDirectory, IDirectoryController, IDirectoryService }; 