import status from 'http-status';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@nifty/api/middlewares/auth';
import { BINDING } from '@nifty/api/domains/binding';
import { UserService } from '@nifty/api/domains';
import type {
  GetUserResponse,
  GetUserRequestParam,
} from '@nifty/api/domains/user/dto';
import { ExpressResponse } from '@nifty/api/domains/dto';

@controller('/v1/users')
export class UserController {
  constructor(@inject(BINDING.USER_SERVICE) private userService: UserService) {}

  @httpGet('/me', auth())
  async getMe(_req: Request, res: Response): ExpressResponse<GetUserResponse> {
    const user = res.locals.user;

    return res.status(status.OK).json({ data: user });
  }

  @httpGet('/:id', auth())
  async getUser(req: Request, res: Response): ExpressResponse<GetUserResponse> {
    const id = Number(req.params.id) as GetUserRequestParam;

    const user = await this.userService.getUserById({ id, select: '*' });

    return res.status(status.OK).json({ data: user });
  }

  // @httpPost('/subscribe')
  // async subscribe(req: Request, res: Response): ExpressResponse<> {
  //   const user = await this.userModel.findOneAndUpdate(
  //     { email: req.body.email },
  //     {
  //       $setOnInsert: { ...req.body },
  //     },
  //     {
  //       new: true, // return new doc if one is upserted
  //       upsert: true, // insert the document if it does not exist
  //     }
  //   );
  //
  //   // await Notification.create({
  //   //   type: 'subscribe',
  //   //   emails: [user.email],
  //   //   data: { user },
  //   // });
  //
  //   res.status(status.CREATED).json({ data: user });
  // }
}
