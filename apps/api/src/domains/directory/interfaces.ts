import { Request, Response } from 'express';

import { IDirectory } from "@nifty/server-lib/models/directory";

interface IDirectoryController {
  getUser(req: Request, res: Response): Promise<void>;
}

interface IDirectoryService {
  getUserById(id: string): Promise<IDirectory | null>;
}

interface IDirectoryRepository {
  create(data: Partial<IDirectory>): Promise<IDirectory>;
  findById(id: string): Promise<IDirectory | null>;
  findByName(name: string): Promise<IDirectory[]>;
  updateById(id: string, data: Partial<IDirectory>): Promise<IDirectory | null>;
  deleteById(id: string): Promise<IDirectory | null>;
}

export { IDirectory, IDirectoryController, IDirectoryService, IDirectoryRepository };