import { Request, Response } from 'express';

import { IDirectory } from "@nifty/server-lib/models/directory";

interface IDirectoryController {
  getDirectory(req: Request, res: Response): Promise<void>;
  createDirectory(req: Request, res: Response): Promise<void>;
}

interface IDirectoryService {
  getDirectoryById(id: string): Promise<IDirectory | null>;
  createDirectory(data: Partial<IDirectory>): Promise<IDirectory>;
}

interface IDirectoryRepository {
  create(data: Partial<IDirectory>): Promise<IDirectory>;
  findById(id: string): Promise<IDirectory | null>;
  findByName(name: string): Promise<IDirectory[]>;
  updateById(id: string, data: Partial<IDirectory>): Promise<IDirectory | null>;
  deleteById(id: string): Promise<IDirectory | null>;
}

export { IDirectory, IDirectoryController, IDirectoryService, IDirectoryRepository };