import { IRefreshToken } from "../types";
import Token, { IToken } from "../../token";

export default function createAccessToken(this: IRefreshToken): IToken {
  const token = new Token({
    user: this.user,
    strategy: "refresh",
  });

  return token;
}