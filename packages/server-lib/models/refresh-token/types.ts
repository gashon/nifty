import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';

export interface IRefreshToken extends Resource {
  user: string;
  expires_at: Date;
  created_by_ip: string;
}

export type TokenDocument = mongoose.Document<string, object, IRefreshToken>;
