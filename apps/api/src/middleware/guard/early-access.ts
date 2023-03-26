import { RequestHandler, Request, Response, NextFunction } from "express";
import status from "http-status";
import { CustomException } from "@/exceptions";

import Token from "@nifty/server-lib/models/token";
import { IUser } from "@nifty/server-lib/models/user";
import RefreshToken from "@nifty/server-lib/models/refresh-token";
import { USER_PERMISSIONS } from "@/../../../packages/common/constants";

const WHITE_LIST = [
  '/v1/users/subscribe',
]

const earlyAccessGuard: RequestHandler = async (req: Request,
  res: Response,
  next: NextFunction) => {

  console.log(req.url, WHITE_LIST, req.url === WHITE_LIST[0])

  for (const path of WHITE_LIST) {
    if (req.url === path) {
      return next();
    }
  }

  const accessToken = await Token.findById(req.cookies.access_token).populate<{ user: IUser }>(
    'user'
  );

  // redirect to referrer if not early access
  if (!accessToken?.user?.permissions?.includes(USER_PERMISSIONS.EARLY_ACCESS)) {
    {
      if (req.url?.includes("ajax") && !req.url?.includes("email"))
        return res.redirect(`/error/internal?${new URLSearchParams({ message: 'You do not have early access to this feature.', redirect: req.headers.referer! }).toString()}`);
      return res.status(status.FORBIDDEN).json({ error: { message: 'You do not have early access to this feature.', type: 'invalid_request_error' } });
    }
  }

  next();
}

export default earlyAccessGuard;