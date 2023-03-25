import { Request, Response } from 'express';

import { IUser } from "@nifty/server-lib/models/user";

interface IUserController {
  getUser(req: Request, res: Response): Promise<void>;
  createUser(req: Request, res: Response): Promise<void>;
}

interface IUserService {
  getMe(accessToken: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  createUser(data: Partial<IUser>): Promise<IUser>;
}

interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByName(name: string): Promise<IUser[]>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteById(id: string): Promise<IUser | null>;
}

export { IUser, IUserController, IUserService, IUserRepository };