import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { UserCreateRequest, UserModel } from '@nifty/server-lib/models/user';
import auth from '@nifty/api/middlewares/auth';

import { IUserController } from '@nifty/api/domains';
import { USER_TYPES } from '@nifty/api/domains/user/types';
@controller('/v1/users')
export class UserController implements IUserController {
  constructor(@inject(USER_TYPES.MODEL) private userModel: UserModel) {}

  @httpGet('/me', auth())
  async getMe(_: Request, res: Response): Promise<void> {
    const user = res.locals.user;
    res.status(status.OK).json({ data: user });
  }

  @httpGet('/:id')
  async getUser(req: Request, res: Response): Promise<void> {
    const user = await this.userModel.findById(req.params.id);
    res.status(status.OK).json({ data: user });
  }

  @httpPost('/')
  async createUser(req: Request, res: Response): Promise<void> {
    const user = await this.userModel.create(req.body as UserCreateRequest);
    res.status(status.CREATED).json({ data: user });
  }

  @httpPost('/subscribe')
  async subscribe(req: Request, res: Response): Promise<void> {
    const user = await this.userModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $setOnInsert: { ...req.body },
      },
      {
        new: true, // return new doc if one is upserted
        upsert: true, // insert the document if it does not exist
      }
    );

    // await Notification.create({
    //   type: 'subscribe',
    //   emails: [user.email],
    //   data: { user },
    // });

    res.status(status.CREATED).json({ data: user });
  }
}
