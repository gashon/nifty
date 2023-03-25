import { RequestHandler, Request, Response, NextFunction } from "express";
import status from "http-status";
import Token from "lib/models/token";
import RefreshToken from "lib/models/refresh-token";
import { IUser } from "lib/models/user";

const earlyAccessGuard: RequestHandler = async (req: Request,
  res: Response,
  next: NextFunction) => {
  const accessToken = await Token.findById(req.cookies.access_token).populate<{ user: IUser }>(
    'user'
  );

  // redirect to referrer if not early access
  if (!accessToken?.user?.early_access) {
    {
      if (req.url?.includes("ajax"))
        return res.redirect(`/error/internal?${new URLSearchParams({ message: 'You do not have early access to this feature.', redirect: req.headers.referer! }).toString()}`);
      return res.status(status.FORBIDDEN).json({ error: { message: 'You do not have early access to this feature.', type: 'invalid_request_error' } });
    }
  }

  next();
}

export default earlyAccessGuard;