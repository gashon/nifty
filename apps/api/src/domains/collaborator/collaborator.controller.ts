import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { CustomException } from '@nifty/api/exceptions';

import { ICollaboratorController } from '@nifty/api/domains';
import { COLLABORATOR_TYPES } from '@nifty/api/domains/collaborator/types';
import { CollaboratorModel } from '@nifty/server-lib/models/collaborator';

@controller('/v1/collaborators')
export class CollaboratorController implements ICollaboratorController {
  constructor(
    @inject(COLLABORATOR_TYPES.MODEL)
    private collaboratorModel: CollaboratorModel
  ) {}
}
