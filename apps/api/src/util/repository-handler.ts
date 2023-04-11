import mongoose from '@nifty/server-lib/mongoose';
import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  QueryOptions,
  Aggregate,
} from 'mongoose';
import omit from 'lodash/omit';
import User from '@nifty/server-lib/models/user';

const f = User.update
type RepositoryHandlers<T> = {
  findOne: (query: FilterQuery<T>) => Promise<T | null>;
  findAll: (query: FilterQuery<T>) => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  update(query: FilterQuery<T>, data: UpdateWithAggregationPipeline | UpdateQuery<T>, options?: QueryOptions<T>): Promise<T | null>;
  updateById: (id: string, data: UpdateWithAggregationPipeline | UpdateQuery<T>) => Promise<T | null>;
  delete(query: FilterQuery<T>): Promise<T | null>;
  deleteById: (id: string) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T>;
  findOrUpsert: (key: Partial<T>, data: Partial<T>) => Promise<T | null>;
  findOneAndUpdate: (query: FilterQuery<T>, data: Partial<T>) => Promise<T | null>;
  findOneAndDelete: (query: FilterQuery<T>) => Promise<T | null>;
  updateMany: (query: FilterQuery<T>, data: UpdateWithAggregationPipeline | UpdateQuery<T>) => Promise<ReturnType<f>>;
  deleteMany: (query: FilterQuery<T>) => Promise<T[]>;
  count: (query: FilterQuery<T>) => Promise<number>;
  countDistinct: (query: FilterQuery<T>) => Promise<number>;
  exists: (query: FilterQuery<T>) => Promise<boolean>;
  sum: (field: keyof T, query?: FilterQuery<T>) => Promise<number>;
  avg: (field: keyof T, query?: FilterQuery<T>) => Promise<number>;
  min: (field: keyof T, query?: FilterQuery<T>) => Promise<number | null>;
  max: (field: keyof T, query?: FilterQuery<T>) => Promise<number | null>;
  groupBy: (field: keyof T, query?: FilterQuery<T>) => Promise<{ _id: any, count: number }[]>;
}

const repositoryHandlers = <T extends Document>(Schema: Model<T>): RepositoryHandlers<T> => ({
  // todo complete this
})
// const repositoryHandlers = <T extends Document>(Schema: Model<T>): RepositoryHandlers<T> => ({
//   findOne: (query: FilterQuery<T>) => Schema.findOne(query).exec(),
//   findAll: (query: FilterQuery<T>) => Schema.find(query).exec(),
//   findById: (id: string) => Schema.findById(id).exec(),
//   update: (query: FilterQuery<T>, data: Partial<T>) => Schema.findOneAndUpdate(query, data, { new: true }).exec(),
//   updateById: (id: string, data: UpdateQuery<T>) => Schema.findByIdAndUpdate(id, data, { new: true }).exec(),
//   delete: (query: FilterQuery<T>) => Schema.findOneAndDelete(query).exec(),
//   deleteById: (id: string) => Schema.findByIdAndDelete(id).exec(),
//   create: (data: Partial<T>) => Schema.create(data),
//   findOrUpsert: async (key: Partial<T>, data: Partial<T>) => {
//     const existingDocument = await Schema.findOne(key).exec();
//     if (existingDocument) {
//       return existingDocument;
//     }
//     return Schema.create(data);
//   },
//   findOneAndUpdate: (query: FilterQuery<T>, data: Partial<T>) => Schema.findOneAndUpdate(query, data, { new: true }).exec(),
//   findOneAndDelete: (query: FilterQuery<T>) => Schema.findOneAndDelete(query).exec(),
//   updateMany: (query: FilterQuery<T>, data: UpdateQuery<T>) => Schema.updateMany(query, data).exec(),
//   deleteMany: (query: FilterQuery<T>) => Schema.deleteMany(query).exec(),
//   count: (query: FilterQuery<T>) => Schema.countDocuments(query).exec(),
//   countDistinct: (query: FilterQuery<T>) => Schema.countDocuments(query).exec(),
//   exists: (query: FilterQuery<T>) => Schema.exists(query).exec(),
//   sum: (field: keyof T, query?: FilterQuery<T>) => Schema.aggregate<T>([
//     { $match: query || {} },
//     { $group: { _id: null, total: { $sum: `$${field}` } } },
//     { $project: { _id: 0, total: 1 } }
//   ]).exec().then(results => results[0]?.total || 0),
//   avg: (field: keyof T, query?: FilterQuery<T>) => Schema.aggregate<T>([
//     { $match: query || {} },
//     { $group: { _id: null, average: { $avg: `$${field}` } } },
//     { $project: { _id: 0, average: 1 } }
//   ]).exec().then(results => results[0]?.average || 0),
//   min: (field: keyof T, query?: FilterQuery<T>) => Schema.aggregate<T>([
//     { $match: query || {} },
//     { $group: { _id: null, min: { $min: `$${field}` } } },
//     { $project: { _id: 0, min: 1 } }
//   ]).exec().then(results => results[0]?.min || null),
//   max: (field: keyof T, query?: FilterQuery<T>) => Schema.aggregate<T>([
//     { $match: query || {} },
//     { $group: { _id: null, max: { $max: `$${field}` } } },
//     { $project: { _id: 0, max: 1 } }
//   ]).exec().then(results => results[0]?.max || null),
//   groupBy: (field: keyof T, query?: FilterQuery<T>) => Schema.aggregate<T>([
//     { $match: query || {} },
//     { $group: { _id: $${ field }, count: { $sum: 1 } } },
// { $project: { _id: 1, count: 1 } }
// ]).exec()
// });