import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { UserCreateRequest } from '@nifty/server-lib/models/user';
import { CustomException } from '@/exceptions';
import { IUserService, IUserController } from './interfaces';
import { TYPES } from "./types";

@controller('/v1/users')
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {
  }

  @httpGet('/me')
  async getMe(req: Request, res: Response): Promise<void> {
    const accessToken = req.headers.access_token as string;
    const user = await this._userService.getMe(accessToken);
    res.status(status.OK).json({ data: user });
  }

  @httpGet('/:id')
  async getUser(req: Request, res: Response): Promise<void> {
    const user = await this._userService.getUserById(req.params.id);
    res.status(status.OK).json({ data: user });
  }

  @httpPost("/")
  async createUser(req: Request, res: Response): Promise<void> {
    const user = await this._userService.createUser(req.body as UserCreateRequest);
    res.status(status.CREATED).json({ data: user });
  }

  @httpPost("/subscribe")
  async subscribe(req: Request, res: Response): Promise<void> {
    const [user, created] = await this._userService.findOrCreate(req.body, { email: req.body.email });

    if (!created)
      throw new CustomException('You are already on the waitlist!', status.CONFLICT);


    // todo add notification (create notification service + repo first)
    // await Notification.create({
    //   type: 'subscribe',
    //   emails: [user.email],
    //   data: { user },
    // });

    res.status(status.CREATED).json({ data: user });
  }
}