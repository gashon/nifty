import status from 'http-status';
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@/middlewares/auth';
import { CustomException } from '@/exceptions';
import {
  DirectoryCreateRequest,
  DirectoryModel,
} from '@nifty/server-lib/models/directory';
import { PaginationParams } from '@/types';
import { IDirectoryController } from '@/domains/directory';
import { ICollaborator } from '@nifty/server-lib/models/collaborator';
import {
  DIRECTORY_TYPES,
  DirectoryCreateResponse,
} from '@/domains/directory/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
import { setPermissions, Permission } from '@/util';
import { NOTE_TYPES } from '../note';
import { NoteModel } from '@nifty/server-lib/models/note';
import collaborator, {
  CollaboratorModel,
} from '@nifty/server-lib/models/collaborator';

@controller('/v1/directories')
export class DirectoryController implements IDirectoryController {
  constructor(
    @inject(DIRECTORY_TYPES.MODEL)
    private directoryModel: DirectoryModel,
    @inject(NOTE_TYPES.MODEL) private noteModel: NoteModel,
    @inject(COLLABORATOR_TYPES.MODEL)
    private collaboratorModel: CollaboratorModel
  ) {}

  @httpGet('/recent', auth())
  async getRecentNotes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const k = (req.query.k as number | undefined) ?? 5;

    if (k < 0 || k > 100)
      throw new CustomException(
        'k must be between 0 and 100',
        status.BAD_REQUEST
      );

    const collaborators = await this.collaboratorModel.find({
      user: userId,
      type: 'directory',
    });

    const directoryIds = collaborators
      .map((c) => (c.type === 'directory' ? c.directory : undefined))
      .filter((id) => !!id);

    const notes = await this.directoryModel
      .find({
        _id: {
          $in: directoryIds,
        },
        deleted_at: null,
      })
      .sort({ created_at: -1 })
      .limit(k);

    res.status(status.OK).json({ data: notes });
  }

  @httpGet('/:id')
  async getDirectory(req: Request, res: Response): Promise<void> {
    const directory = await this.directoryModel.findById(req.params.id);
    res.status(status.OK).json({ data: directory });
  }

  @httpGet('/', auth())
  async getDirectories(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const { sort } = req.query as PaginationParams<ICollaborator>;

    const collaborators = await this.collaboratorModel.find({
      user: userId,
      deleted_at: null,
      sort,
    });

    const collaboratorIds = collaborators.data.map((c) => c.id);
    const directories = await this.directoryModel
      .find({
        collaborators: {
          $in: collaboratorIds,
        },
        deleted_at: null,
      })
      .sort({ created_at: -1 });

    res.status(status.OK).json({ data: directories });
  }

  @httpPost('/', auth())
  async createDirectory(
    req: Request,
    res: Response
  ): Promise<Response<DirectoryCreateResponse>> {
    const createdBy = res.locals.user._id;
    // validate parent
    const parent = await this.directoryModel.findById(req.body.parent);
    if (parent && parent._id) {
      // TODO(gashon) move to collaborator method
      const collaboratorAggregation = await this.collaboratorModel.aggregate([
        {
          $match: {
            user: createdBy,
          },
        },
        {
          $lookup: {
            from: 'directories',
            localField: '_id',
            foreignField: 'collaborators',
            as: 'directory',
          },
        },
        {
          $unwind: {
            path: '$directory',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'directory._id': parent._id,
          },
        },
      ]);

      const collaborator = collaboratorAggregation[0] || null;
      if (!collaborator)
        throw new CustomException(
          'You do not have access to this directory',
          status.FORBIDDEN
        );
    }

    const rootCollaborator = await this.collaboratorModel.create({
      permissions: setPermissions(Permission.ReadWriteDelete),
      user: createdBy,
      type: 'directory',
      created_by: createdBy,
    });

    const doc = req.body as DirectoryCreateRequest;
    const directory = await this.directoryModel.create({
      ...doc,
      collaborators: [rootCollaborator.id],
      created_by: createdBy,
      parent: null,
    });

    rootCollaborator.set({ directory: directory.id });
    rootCollaborator.save();

    return res.status(status.CREATED).json({ data: directory });
  }

  @httpDelete('/:id', auth())
  async deleteDirectory(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const directory = await this.directoryModel.findById(req.params.id);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    // TODO(gashon) move to collaborators method
    const collaboratorsAggregation = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: 'directories',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'directory',
        },
      },
      {
        $unwind: {
          path: '$directory',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'directory._id': directory.id,
        },
      },
    ]);

    const collaborator = collaboratorsAggregation[0] || null;

    if (!collaborator || !directory.collaborators.includes(collaborator._id))
      throw new CustomException(
        'You do not have access to this directory',
        status.FORBIDDEN
      );

    // handle cascading deletions
    // TODO (gashon) handle in transaction
    await Promise.all([
      this.noteModel.updateMany(
        {
          _id: { $in: directory.notes },
        },
        { $set: { deleted_at: new Date() } },
        { new: true }
      ),
      this.directoryModel.updateOne(
        {
          _id: directory.id,
        },
        {
          $set: {
            deleted_at: new Date(),
          },
        },
        {}
      ),
    ]);

    res.status(status.NO_CONTENT).send();
  }
}
