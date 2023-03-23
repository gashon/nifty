import { IRefreshToken } from "../types";
import Token, { IToken } from "../../token";

export default function createAccessToken(this: IRefreshToken): Promise<IToken> {
  return Token.create({
    user: this.user,
    strategy: 'refresh',
  });
}