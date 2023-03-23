import { IUser } from 'lib/models/user';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
