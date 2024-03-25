import { ErrorRequestHandler } from 'express';
import * as Sentry from "@sentry/node";
import mongoose from '@nifty/server-lib/mongoose';
import { CustomException } from '../exceptions';
import logger from '@nifty/api/lib/logger';

const errorHandler: ErrorRequestHandler = function errorHandler(err, req, res, next) {
  logger.error(JSON.stringify(err));

  //send error to sentry
  res.sentry = Sentry.captureException(err);
  if (err instanceof CustomException) {
    res.status(err.statusCode).send({
      error: {
        message: err.message,
        status: err.statusCode,
        type: 'invalid_request_error',
        sentry_id: res.sentry,
      },
    });
  } else if (err instanceof SyntaxError) {
    res.status(400).send({
      error: {
        message: 'Invalid request (check your POST parameters): unable to parse JSON request body',
        type: 'invalid_request_error',
      },
    });
  } else if ((err.name === 'MongoError' || err.name === 'MongoServerError') && err.code === 11000) {

    const [path, value] = Object.entries(err.keyValue)[0];

    res.status(400).send({
      error: {
        param: path,
        message: `Error, expected \`${path}\` to be unique. Value: \`${value}\``,
        type: 'invalid_request_error',
        sentry_id: res.sentry,
      },
    });
  } else if (err instanceof mongoose.Error.ValidationError) {

    res.status(400).send({
      error: {
        param: Object.keys(err.errors)[0],
        message: Object.values(err.errors)[0].message,
        type: 'invalid_request_error',
        sentry_id: res.sentry,
      },
    });
  } else if (err instanceof mongoose.Error.CastError) {

    res.status(400).send({
      error: {
        param: err.path,
        message: err.message,
        type: 'invalid_request_error',
        sentry_id: res.sentry,
      },
    });
  } else {

    res.status(500).send({
      error: {
        message:
          'Something went wrong on our end. Please open a ticket at <Nifty>', // TODO: Discord link
        type: 'api_error',
        sentry_id: res.sentry,
      },
    });
  }

  next();
};

export default errorHandler;
