import { Request, Response } from 'express';

import { IDirectory } from "@nifty/server-lib/models/directory";

interface IDirectoryController {
  getUser(req: Request, res: Response): Promise<void>;
}

interface IDirectoryService {
  getUserById(id: string): Promise<IDirectory | null>;
}

interface IDirectoryRepository {
  findById(id: string): Promise<IDirectory | null>;
  // find(query: any): Promise<IDirectory[]>;
  // findOne(query: any): Promise<IDirectory>;
  // create(data: any): Promise<IDirectory>;
  // update(id: string, data: any): Promise<IDirectory>;
  // delete(id: string): Promise<IDirectory>;
}

export { IDirectory, IDirectoryController, IDirectoryService, IDirectoryRepository };