import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { IToken, LoginStrategy } from '../token';

export interface IUser extends Resource {
  name: string;
  email: string;
  avatar: string;
  admin: boolean;
  last_login?: Date | number;
  /** @ignore */
  generateToken: (strategy: LoginStrategy) => Promise<IToken>;
}

export type UserDocument = mongoose.Document<string, object, IUser>;
