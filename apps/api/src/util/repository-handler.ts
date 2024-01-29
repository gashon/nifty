import {
  FilterQuery,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  QueryOptions,
} from 'mongoose';
import User from '@nifty/server-lib/models/user';

const f = User.update;
type RepositoryHandlers<T> = {
  findOne: (query: FilterQuery<T>) => Promise<T | null>;
  findAll: (query: FilterQuery<T>) => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  update(
    query: FilterQuery<T>,
    data: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T | null>;
  updateById: (
    id: string,
    data: UpdateWithAggregationPipeline | UpdateQuery<T>
  ) => Promise<T | null>;
  delete(query: FilterQuery<T>): Promise<T | null>;
  deleteById: (id: string) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T>;
  findOrUpsert: (key: Partial<T>, data: Partial<T>) => Promise<T | null>;
  findOneAndUpdate: (
    query: FilterQuery<T>,
    data: Partial<T>
  ) => Promise<T | null>;
  findOneAndDelete: (query: FilterQuery<T>) => Promise<T | null>;
  updateMany: (
    query: FilterQuery<T>,
    data: UpdateWithAggregationPipeline | UpdateQuery<T>
  ) => Promise<T[]>;
  deleteMany: (query: FilterQuery<T>) => Promise<T[]>;
  count: (query: FilterQuery<T>) => Promise<number>;
  countDistinct: (query: FilterQuery<T>) => Promise<number>;
  exists: (query: FilterQuery<T>) => Promise<boolean>;
  sum: (field: keyof T, query?: FilterQuery<T>) => Promise<number>;
  avg: (field: keyof T, query?: FilterQuery<T>) => Promise<number>;
  min: (field: keyof T, query?: FilterQuery<T>) => Promise<number | null>;
  max: (field: keyof T, query?: FilterQuery<T>) => Promise<number | null>;
  groupBy: (
    field: keyof T,
    query?: FilterQuery<T>
  ) => Promise<{ _id: any; count: number }[]>;
};
//
// const repositoryHandlers = <T extends Document>(Schema: Model<T>): RepositoryHandlers<T> => ({
//   // todo complete this
// })
