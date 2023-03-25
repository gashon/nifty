import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { DirectoryCreateRequest } from '@nifty/server-lib/models/directory';
import { IDirectoryService, IDirectoryController } from './interfaces';
import { TYPES } from "./types";

@controller('/v1/directories')
export class DirectoryController implements IDirectoryController {
  constructor(@inject(TYPES.DirectoryService) private _directoryService: IDirectoryService) {
  }

  @httpGet('/:id')
  async getDirectory(req: Request, res: Response): Promise<void> {
    const user = await this._directoryService.getDirectoryById(req.params.id);
    res.status(status.OK).json({ data: user });
  }

  @httpPost("/")
  async createDirectory(req: Request, res: Response): Promise<void> {
    const user = await this._directoryService.createDirectory(req.body as DirectoryCreateRequest);
    res.status(status.CREATED).json({ data: user });
  }
}