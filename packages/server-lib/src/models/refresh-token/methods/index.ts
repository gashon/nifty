import { IRefreshToken } from '../types';
import Token, { IToken } from '../../token';

export type IRefreshTokenMethods = {
  createAccessToken: (r: IRefreshToken) => Promise<IToken>;
};

export function createAccessToken(this: IRefreshToken): Promise<IToken> {
  return Token.create({
    user: this.user,
    strategy: 'refresh',
  });
}
