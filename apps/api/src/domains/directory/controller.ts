import { controller, httpGet } from 'inversify-express-utils';
import { IDirectoryService } from './interfaces';
import { inject } from 'inversify';
import { Request, Response } from 'express';

@controller('/users')
export class UserController {
  constructor(@inject('DirectoryService') private directoryService: IDirectoryService) { }

  @httpGet('/:id')
  async getUserById(req: Request, res: Response): Promise<void> {
    const user = await this.directoryService.getUserById(req.params.id);
    res.json(user);
  }
}