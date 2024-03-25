import type { Request, Response } from 'express';
import type { DirectoryCreateResponse } from '@nifty/api/domains/directory/types';

interface IDirectoryController {
  getDirectory(req: Request, res: Response): Promise<void>;
  createDirectory(
    req: Request,
    res: Response
  ): Promise<Response<DirectoryCreateResponse>>;
  getDirectories(req: Request, res: Response): Promise<void>;
}

export type { IDirectoryController };
