import * as express from 'express';
import * as status from 'http-status';
import { Body, OperationId, Controller, Post, Response, Route, Tags, Inject } from 'tsoa';

import Notification from 'lib/models/notification';
import User, { UserCreateRequest } from 'lib/models/user';

@Route('subscribe')
@Tags('Subscribe')
class SubscribeController extends Controller {
  @Post()
  @OperationId('user_subscribe')
  @Response<any>(201, 'Created')
  @Response(400, 'Bad Request')
  @Response(401, 'Unauthorized')
  public async create(
    @Inject() req: express.Request,
    @Inject() res: express.Response,
    @Inject() next: express.NextFunction,
    @Body() body?: UserCreateRequest
  ): Promise<any> {
    console.log("HITTING")
    if (!body)
      return res.status(status.BAD_REQUEST).json({ message: 'Missing body' });

    // find ord create user
    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $set: {} },
      { upsert: true, new: true }
    )
    console.log("USER", user)

    // await Notification.create({
    //   type: 'subscribe',
    //   emails: [user.email],
    //   data: { user },
    // });

    res.status(status.CREATED).json({ message: 'Thank you for subscribing!' });
  }
}

export default new SubscribeController();