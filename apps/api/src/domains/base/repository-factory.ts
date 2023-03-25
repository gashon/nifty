import 'reflect-metadata';
import { FilterQuery, Model, Document } from 'mongoose';
import { injectable, interfaces } from 'inversify';

import * as models from '@nifty/server-lib/models';

export interface IBaseRepositoryFactory {
  create<T extends Document>(Schema: Model<T>): IBaseRepository<T>;
}

export interface IBaseRepository<T extends Document> extends Model<T> {
  // additional custom methods (for complex queries)
  sum: (field: keyof T, query?: FilterQuery<T>) => Promise<number>;
  avg: (field: keyof T, query?: FilterQuery<T>) => Promise<number>;
  min: (field: keyof T, query?: FilterQuery<T>) => Promise<number | null>;
  max: (field: keyof T, query?: FilterQuery<T>) => Promise<number | null>;
  groupBy: (field: keyof T, query?: FilterQuery<T>) => Promise<{ _id: any, count: number }[]>;
}

export const baseRepository = <T extends Document>(Schema: Model<T>): IBaseRepository<T> => {
  const repo = Schema as IBaseRepository<T>;

  // additional custom methods can be added to each repository here!
  
  repo.sum = async (field: keyof T, query?: FilterQuery<T>): Promise<number> => {
    const result = await repo.aggregate([{ $match: query || {} }, { $group: { _id: null, total: { $sum: `$${String(field)}` } } }]);
    return result.length > 0 ? result[0].total : 0;
  };

  repo.avg = async (field: keyof T, query?: FilterQuery<T>): Promise<number> => {
    const result = await repo.aggregate([{ $match: query || {} }, { $group: { _id: null, average: { $avg: `$${field}` } } }]);
    return result.length > 0 ? result[0].average : 0;
  };

  repo.min = async (field: keyof T, query?: FilterQuery<T>): Promise<number | null> => {
    const result = await repo.aggregate([{ $match: query || {} }, { $group: { _id: null, minimum: { $min: `$${field}` } } }]);
    return result.length > 0 ? result[0].minimum : null;
  };

  repo.max = async (field: keyof T, query?: FilterQuery<T>): Promise<number | null> => {
    const result = await repo.aggregate([{ $match: query || {} }, { $group: { _id: null, maximum: { $max: `$${field}` } } }]);
    return result.length > 0 ? result[0].maximum : null;
  };

  repo.groupBy = async (field: keyof T, query?: FilterQuery<T>): Promise<{ _id: any, count: number }[]> => {
    const result = await repo.aggregate([{ $match: query || {} }, { $group: { _id: `$${field}`, count: { $sum: 1 } } }]);
    return result;
  };

  return repo;
};

@injectable()
export class BaseRepositoryFactory implements IBaseRepositoryFactory {
  create<T extends Document>(Schema: Model<T>): IBaseRepository<T> {
    return baseRepository<T>(Schema);
  }
}
