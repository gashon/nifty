import { ObjectId } from "mongodb";
import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';

export interface IRefreshToken extends Resource {
  user: ObjectId;
  expires_at: Date;
  created_by_ip: string;
}

export type RefreshTokenDocument = mongoose.Document<string, object, IRefreshToken>;
