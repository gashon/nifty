import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { IRefreshTokenMethods } from './methods';

export interface IRefreshToken extends Resource {
  user: string;
  expires_at: Date;
  created_by_ip: string;
}

export type RefreshTokenDocument = mongoose.Document<
  string,
  object,
  IRefreshToken
>;

export type RefreshTokenModel = mongoose.Model<
  IRefreshToken,
  any,
  IRefreshTokenMethods
>;
