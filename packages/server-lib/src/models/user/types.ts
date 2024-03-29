import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { IToken, LoginStrategy } from '../token';
export interface IUser extends Resource {
  name: string;
  email: string;
  avatar: string;
  last_login?: Date | number;
  permissions?: string[];
  /** @ignore */
  generateToken: (strategy: LoginStrategy) => Promise<IToken>;
}

export type UserCreateRequest = Partial<Pick<IUser, 'email'>>;

export type UserDocument = mongoose.Document<string, object, IUser>;

export type UserModel = mongoose.Model<IUser>;
