import { Request, Response } from 'express';
import { IUser, UserDocument } from "@nifty/server-lib/models/user";
import { IBaseRepository } from '../../lib/repository-base';
interface IUserController {
  getUser(req: Request, res: Response): Promise<void>;
  createUser(req: Request, res: Response): Promise<void>;
}

interface IUserService {
  getMe(accessToken: string): Promise<UserDocument | null>;
  getUserById(id: string): Promise<UserDocument | null>;
  createUser(data: Partial<IUser>): Promise<UserDocument>;
  findOrCreate(key: Partial<IUser>, data: Partial<IUser>): Promise<[UserDocument, boolean]>;
}

interface IUserRepository extends IBaseRepository<UserDocument> {
  // add custom methods here :)
}

export { IUser, IUserController, IUserService, IUserRepository };