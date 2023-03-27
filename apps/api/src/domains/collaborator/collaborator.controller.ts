import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { CustomException } from '@/exceptions';
import { ICollaboratorService, ICollaboratorController } from './interfaces';
import { TYPES } from "./types";

@controller('/v1/collaborators')
export class CollaboratorController implements ICollaboratorController {
  constructor(@inject(TYPES.CollaboratorService) private _collaboratorService: ICollaboratorService) {
  }


}