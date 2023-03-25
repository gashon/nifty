import { injectable } from 'inversify';
import User from "@nifty/server-lib/models/user";
import { IUserRepository, IUser } from './interfaces';
import { SearchKey } from "./types"

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    await user.save();
    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async findByName(name: string): Promise<IUser[]> {
    return await User.find({ name }).exec();
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updatedUser;
  }

  async deleteById(id: string): Promise<IUser | null> {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { deleted_at: Date.now() },
      { new: true }
    ).exec();
    return deletedUser;
  }

  async findOrUpsert(key: SearchKey, data: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findOneAndUpdate({ ...key }, data, {
      new: true,
      upsert: true,
      runValidators: true,
    }).exec();

    return user;
  }
}