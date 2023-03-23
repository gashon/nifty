import { RequestHandler } from 'express';
import status from 'http-status';
import mongoose from 'lib/mongoose';
import omit from 'lodash/omit';

type RestHandlers = {
  create: RequestHandler;
  retrieve: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
  list: RequestHandler;
};

const restHandlers = <T>(
  Schema: mongoose.Model<T>,
  omitProperties: (keyof T)[] = []
): RestHandlers => ({
  create: async (req, res, next) => {
    try {
      const item = await Schema.create({
        ...omit(req.body, ['_id', ...omitProperties]),
        user: res.locals.user.id,
      });

      res.send(item);
    } catch (err) {
      next(err);
    }
  },

  retrieve: async (req, res, next) => {
    try {
      const item = await Schema.findOne({
        ...req.query,
        _id: req.params.id,
        user: res.locals.user.id,
      });

      if (!item) return res.sendStatus(status.NOT_FOUND);

      res.send(item);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const item = await Schema.findOne({
        _id: req.params.id,
        user: res.locals.user.id,
      });

      if (!item) return res.sendStatus(status.NOT_FOUND);

      const updatedItem = await Schema.findOneAndUpdate(
        { _id: item.id },
        omit(req.body, [...omitProperties]),
        { new: true, runValidators: true }
      );

      res.send(updatedItem);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const item = await Schema.findOneAndUpdate({
        _id: req.params.id,
        user: res.locals.user.id,
      }, { $set: { deleted_at: new Date().getTime() } });

      if (!item) return res.sendStatus(status.NOT_FOUND);

      res.send(item);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const items = await Schema.paginate({
        ...req.query,
        user: res.locals.user.id,
      });

      res.send(items);
    } catch (err) {
      next(err);
    }
  },
});

export default restHandlers;
