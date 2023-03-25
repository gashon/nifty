import { inject, injectable } from 'inversify';
import { IUserService, IUserRepository, IUser } from './interfaces';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private _userRepository: IUserRepository,
  ) { }

  async getMe(accessToken: string): Promise<IUser | null> {
    // todo implement this (get token repository)
    // const token = await Token.findById(req.cookies.access_token).populate('user');
    // if (!token) return res.sendStatus(status.UNAUTHORIZED);

    // res.send(token.user);
    return null;
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this._userRepository.findById(id);
  }

  async createUser(User: Partial<IUser>): Promise<IUser> {
    return this._userRepository.create(User);
  }
}