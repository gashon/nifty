import { sign, verify } from "jsonwebtoken";

const secret: string = process.env.JWT_SECRET!;

export const createToken = <T extends Object>(
  payload: T,
  expiresIn = undefined,
) => {
  return sign(payload, secret, expiresIn ? { expiresIn } : {});
};

export const verifyToken = <T>(token: string | undefined) => {
  if (!token) throw new Error("No token provided");
  return verify(token, secret) as T;
};

