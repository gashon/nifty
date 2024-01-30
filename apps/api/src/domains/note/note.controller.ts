import status from 'http-status';
import {
  controller,
  httpGet,
  httpPost,
  httpPatch,
  httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@/middlewares/auth';
import { CustomException } from '@/exceptions';
import {
  INote,
  NoteCreateRequest,
  NoteModel,
} from '@nifty/server-lib/models/note';
import { PaginationParams } from '@/types';
import { INoteController } from '@/domains/note';
import { NOTE_TYPES, NoteCreateResponse } from '@/domains/note/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
import { DIRECTORY_TYPES } from '@/domains/directory/types';
import { setPermissions, Permission, checkPermissions } from '@/util';
import {
  CollaboratorDocument,
  CollaboratorModel,
} from '@nifty/server-lib/models/collaborator';
import { DirectoryModel } from '@nifty/server-lib/models/directory';

@controller('/v1/notes')
export class NoteController implements INoteController {
  constructor(
    @inject(NOTE_TYPES.MODEL) private noteModel: NoteModel,
    @inject(DIRECTORY_TYPES.MODEL) private directoryModel: DirectoryModel,
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
      type: 'note',
    });

    const noteIds = collaborators
      .map((c) => c.type === 'note' && c.note)
      .filter((id) => !!id);

    const notes = await this.noteModel
      .find(
        {
          _id: {
            $in: noteIds,
          },
          deleted_at: null,
        },
        {
          _id: 1,
          title: 1,
          created_at: 1,
          updated_at: 1,
          collaborators: 1,
          public_permissions: 1,
        }
      )
      .sort({ updated_at: -1 })
      .limit(k);

    res.status(status.OK).json({ data: notes });
  }

  @httpGet('/:id/neighbors', auth())
  async getNoteNeighbors(req: Request, res: Response): Promise<void> {
    const { sort, limit } = req.query as PaginationParams<INote>;
    const userId = res.locals.user._id;
    const noteId = req.params.id;

    // limit must be an even number to get the same number of notes before and after
    if (!limit || limit % 2 !== 0 || limit < 0)
      throw new CustomException(
        'Limit must be an even number',
        status.BAD_REQUEST
      );

    const note = await this.noteModel.findById(noteId);
    if (!note) throw new CustomException('Note not found', status.NOT_FOUND);

    const collaboratorsAggregation = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'note',
        },
      },
      {
        $unwind: {
          path: '$note',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'note._id': noteId,
        },
      },
    ]);

    const collaborator = collaboratorsAggregation[0] || null;

    if (
      !checkPermissions(note.public_permissions, Permission.Read) &&
      !collaborator
    )
      throw new CustomException(
        'You do not have access to this note',
        status.FORBIDDEN
      );

    const directory = await this.directoryModel.findOne({
      notes: {
        $in: [noteId],
      },
    });

    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    if (!note) {
      res.json({ data: { before: [], after: [] } });
      return;
    }

    // find neighbors
    const query = {
      _id: {
        $ne: noteId,
      },
      directory_id: directory.id,
      deleted_at: null,
    };

    const [before, after] = await Promise.all([
      this.noteModel
        .find({ ...query, created_at: { $lt: note.created_at } })
        .sort({ created_at: -1 })
        .limit(limit),
      this.noteModel
        .find({ ...query, created_at: { $gt: note.created_at } })
        .sort({ created_at: 1 })
        .limit(limit),
    ]);

    const data = { neighbors: { before, after } };
    res.status(status.OK).json({ data });
  }

  @httpGet('/:id', auth())
  async getNote(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const note = await this.noteModel.findById(req.params.id);

    if (!note) throw new CustomException('Note not found', status.NOT_FOUND);

    if (
      !checkPermissions(note.public_permissions, Permission.Read) &&
      !note.collaborators.includes(userId)
    )
      throw new CustomException(
        'You do not have access to this note',
        status.FORBIDDEN
      );

    // update last viewed at
    const { collaborators } = await note.populate('collaborators');
    const collaborator = collaborators.find(
      (collaborator: any) => collaborator.user === userId
    ) as CollaboratorDocument | undefined;
    if (collaborator) {
      collaborator.set({
        last_viewed_at: new Date(),
      });
      collaborator.save();
    }

    res.status(status.OK).json({ data: note });
  }

  @httpGet('/', auth())
  async getNotes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const directoryId = req.query.directory_id as string | undefined;
    let notes;

    if (directoryId) {
      // validate directory exists
      const directory = await this.directoryModel.findById(directoryId);
      if (!directory)
        throw new CustomException('Directory not found', status.NOT_FOUND);

      // validate user has access to directory
      // TODO(gashon) make this a method in CollaboratorModel
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
            'directory._id': directoryId,
          },
        },
      ]);

      const collaborator = collaboratorsAggregation[0] || null;
      if (!collaborator)
        throw new CustomException(
          'You do not have access to this directory',
          status.FORBIDDEN
        );

      // paginate notes by directory id
      const query = {
        ...req.query,
      } as PaginationParams<INote>;

      notes = this.noteModel.paginate({
        id: {
          $in: directory.notes,
        },
        ...query,
      });
    } else {
      notes = await this.noteModel.paginate({
        filter: {
          'collaborators.user': userId,
        },
      });
    }

    res.status(status.OK).json({ data: notes });
  }

  @httpPost('/', auth())
  async createNote(
    req: Request,
    res: Response
  ): Promise<Response<NoteCreateResponse>> {
    const createdBy = res.locals.user._id;
    const directoryId = req.body.directory_id;

    // validate directory exists
    const directory = await this.directoryModel.findById(directoryId);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    // validate user has access to directory
    // TODO(gashon) attach this to collaborator method
    const collaboratorsAggregation = await this.collaboratorModel.aggregate([
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
          'directory._id': directoryId,
        },
      },
    ]);

    const collaborator = collaboratorsAggregation[0] || null;
    if (!collaborator)
      throw new CustomException(
        'You do not have access to this directory',
        status.FORBIDDEN
      );

    const noteCollaborator = await this.collaboratorModel.create({
      user: createdBy,
      type: 'note',
      permissions: setPermissions(Permission.ReadWriteDelete),
      created_by: createdBy,
    });

    const { public_permissions, ...noteBody } = req.body as NoteCreateRequest;
    const doc = {
      public_permissions: setPermissions(
        (public_permissions ?? Permission.None) as Permission
      ),
      collaborators: [noteCollaborator.id],
      ...noteBody,
      created_by: createdBy,
      parent: null,
    };
    const note = await this.noteModel.create(doc);

    // add the note to the directory
    directory.set({
      notes: [...directory.notes, note.id],
      collaborators: [...directory.collaborators],
    });
    noteCollaborator.set({ note: note.id });

    await Promise.all([directory.save(), noteCollaborator.save()]);

    return res.status(status.CREATED).json({ data: note });
  }

  @httpPatch('/:id', auth())
  async updateNote(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;
    // TODO(gashon) attach NoteUpdateRequest type!
    const data = req.body;

    // validate note exists
    const note = await this.noteModel.findById(id);
    if (!note) throw new CustomException('Note not found', status.NOT_FOUND);

    // TODO(gashon) attach this to collaborator methods
    const collaboratorsAggregation = await this.collaboratorModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'collaborators',
          as: 'note',
        },
      },
      {
        $unwind: {
          path: '$note',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'note._id': note.id,
        },
      },
    ]);

    const collaborator = collaboratorsAggregation[0] || null;

    // validate user has access to note
    if (
      !checkPermissions(note.public_permissions, Permission.ReadWrite) &&
      !collaborator
    )
      throw new CustomException(
        'You do not have access to this note',
        status.FORBIDDEN
      );

    if (data.public_permissions !== undefined) {
      if (!collaborator || collaborator.user !== note.created_by)
        throw new CustomException(
          'Only the note owner can change this setting',
          status.NOT_ACCEPTABLE
        ); // todo fix to FORBIDDEN without error page redirect (axios interceptor)
      throw new CustomException(
        'Realtime collaboration is not yet a support feature',
        status.NOT_ACCEPTABLE
      ); // todo fix to FORBIDDEN without error page redirect (axios interceptor)
    }

    // update note
    const updatedNote = await this.noteModel.updateOne(
      { _id: id },
      { $set: data }
    );

    res.status(status.OK).json({ data: updatedNote });
  }

  @httpDelete('/:id', auth())
  async deleteNoteById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;

    // validate note exists
    const note = await this.noteModel.findById(id);
    if (!note) throw new CustomException('Note not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorModel.findOne({
      note: note.id,
      type: 'note',
      ...(userId && { user: userId }),
    });

    // validate user has access to note
    if (
      !checkPermissions(note.public_permissions, Permission.ReadWriteDelete) &&
      !collaborator
    )
      throw new CustomException(
        'You do not have access to this note',
        status.FORBIDDEN
      );

    // todo handle permissions

    // delete note
    await this.noteModel.updateOne(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    );

    res.status(status.NO_CONTENT).json();
  }
}
