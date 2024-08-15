import { sign, verify } from 'jsonwebtoken';

export const createToken = <T extends Object>(
  payload: T,
  expiresIn = undefined
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set');
  }

  return sign(payload, process.env.JWT_SECRET!, expiresIn ? { expiresIn } : {});
};

export const verifyToken = <T>(token: string | undefined) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
  else if (!token) throw new Error('No token provided');

  return verify(token, process.env.JWT_SECRET) as T;
};
