import type { Request, Response } from 'express';
import type { NoteCreateResponse } from '@/domains/note/types';

interface INoteController {
  getNote(req: Request, res: Response): Promise<void>;
  createNote(
    req: Request,
    res: Response
  ): Promise<Response<NoteCreateResponse>>;
  getNotes(req: Request, res: Response): Promise<void>;
}

export type { INoteController };
