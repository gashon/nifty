import type { Request, Response, NextFunction } from 'express';

const DEFAULT_LIMIT = 10;

export function paginator() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      // set default limit to 10
      // must be a string to be used in the query
      req.query = { limit: `${DEFAULT_LIMIT}`, ...req.query };
      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}
