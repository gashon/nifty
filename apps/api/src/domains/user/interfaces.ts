import type { Request, Response } from 'express';

interface IUserController {
  getUser(req: Request, res: Response): Promise<void>;
  createUser(req: Request, res: Response): Promise<void>;
}

export type { IUserController };
