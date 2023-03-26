import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import User, { UserDocument } from "@nifty/server-lib/models/user";
import { IBaseRepositoryFactory, IBaseRepository } from "../../lib/repository-base";
import { IUserService, IUserRepository, IUser } from './interfaces';

@injectable()
export class UserService implements IUserService {
  private userModel: IUserRepository;
  constructor(
    @inject('RepositoryGetter') repo: IBaseRepositoryFactory,
  ) {
    this.userModel = repo.get<UserDocument>(User);
  }

  async getMe(accessToken: string): Promise<UserDocument | null> {
    // todo implement this (get token repository)
    // const token = await Token.findById(req.cookies.access_token).populate('user');
    // if (!token) return res.sendStatus(status.UNAUTHORIZED);

    // res.send(token.user);
    return null;
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async createUser(User: Partial<IUser>): Promise<UserDocument> {
    const user = await this.userModel.create(User);
    return user;
  }

  async findOrCreate(key: Partial<IUser>, data: Partial<IUser>): Promise<[UserDocument, boolean]> {
    const user = await this.userModel.findOne(key);
    if (user) return [user, false];

    return [await this.userModel.create(data), true];
  }
}