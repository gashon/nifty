import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import User, { UserDocument } from "@nifty/server-lib/models/user";
import { IBaseRepositoryFactory, IBaseRepository } from "../base/repository-factory";
import { IUserService, IUserRepository, IUser } from './interfaces';
import { SearchKey } from "./types"

@injectable()
export class UserService implements IUserService {
  private _userRepository: IUserRepository;
  constructor(
    @inject('RepositoryFactory') factory: IBaseRepositoryFactory,
  ) {
    this._userRepository = factory.create<UserDocument>(User);
  }

  async getMe(accessToken: string): Promise<IUser | null> {
    // todo implement this (get token repository)
    // const token = await Token.findById(req.cookies.access_token).populate('user');
    // if (!token) return res.sendStatus(status.UNAUTHORIZED);

    // res.send(token.user);
    return null;
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this._userRepository.findById(id);
  }

  async createUser(User: Partial<IUser>): Promise<UserDocument> {
    const user = await this._userRepository.create(User);
    return user;
  }

  async findOrUpdate(key: SearchKey, data: Partial<IUser>): Promise<IUser | null> {
    return this._userRepository.findOrUpsert(key, data);
  }
}