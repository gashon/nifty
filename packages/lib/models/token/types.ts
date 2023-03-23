import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';

export type LoginStrategy = 'email' | 'google' | 'invite';
export interface IToken extends Resource {
  user: string;
  strategy: LoginStrategy;
  /** @ignore */
  getLoginLink: (redirect: string) => URL;
}

export type TokenDocument = mongoose.Document<string, object, IToken>;
