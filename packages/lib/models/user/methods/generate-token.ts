import Token, { IToken, LoginStrategy } from '../../token';
import { IUser } from "../types";

/*  Generate a token
    - Invalidate (delete) all older tokens for this user
    - Create a new token for this user
    - Return their login token
*/
export default async function generateToken(this: IUser, strategy: LoginStrategy): Promise<IToken> {
  await Token.deleteMany({ user: this.id });

  return Token.create({
    user: this.id,
    strategy,
  });
};
