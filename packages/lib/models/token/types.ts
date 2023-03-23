import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';

export type LoginStrategy = 'email' | 'google' | 'invite' | 'refresh';
export interface IToken extends Resource {
  user: string;
  strategy: LoginStrategy;
  expires_at?: Date;
}

export type TokenDocument = mongoose.Document<string, object, IToken>;
