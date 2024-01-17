import { injectable } from 'inversify';
import { Model } from 'mongoose';
import User, { UserDocument } from '@nifty/server-lib/models/user';
import { IUserService, IUser } from './interfaces';

@injectable()
export class UserService implements IUserService {
  private userModel: Model<IUser>;
  constructor() {
    this.userModel = User;
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async createUser(User: Partial<IUser>): Promise<UserDocument> {
    const user = await this.userModel.create(User);
    return user;
  }

  async findOrCreate(
    key: Partial<IUser>,
    data: Partial<IUser>
  ): Promise<[UserDocument, boolean]> {
    const user = await this.userModel.findOne(key);
    if (user) return [user, false];

    return [await this.userModel.create(data), true];
  }
}
