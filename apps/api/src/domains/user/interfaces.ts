import { Request, Response } from 'express';
import { IUser, UserDocument } from "@nifty/server-lib/models/user";
interface IUserController {
  getUser(req: Request, res: Response): Promise<void>;
  createUser(req: Request, res: Response): Promise<void>;
}

interface IUserService {
  findUserById(id: string): Promise<UserDocument | null>;
  createUser(data: Partial<IUser>): Promise<UserDocument>;
  findOrCreate(key: Partial<IUser>, data: Partial<IUser>): Promise<[UserDocument, boolean]>;
}

export { IUser, IUserController, IUserService };