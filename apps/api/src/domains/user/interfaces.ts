import { Request, Response } from 'express';
import { IUser, UserDocument } from "@nifty/server-lib/models/user";
import { IBaseRepository } from '../base/repository-factory';
interface IUserController {
  getUser(req: Request, res: Response): Promise<void>;
  createUser(req: Request, res: Response): Promise<void>;
}

interface IUserService {
  getMe(accessToken: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  createUser(data: Partial<IUser>): Promise<UserDocument>;
  findOrUpdate(key: SearchKey, data: Partial<IUser>): Promise<IUser | null>;
}

interface IUserRepository extends IBaseRepository<UserDocument> { }

export { IUser, IUserController, IUserService, IUserRepository };