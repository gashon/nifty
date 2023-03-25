import { IApiKey } from '@/../../../packages/server-lib/models/api-key';
import { INotification } from '@/../../../packages/server-lib/models/notification';
import { IQuery } from 'lib/models/query';
import { IToken } from 'lib/models/token';
import { IUser } from '@/../../../packages/server-lib/models/user';
import { IDataset } from '../../lib/models/dataset';

type Paginator<T> = (
  filter: object
) => Promise<{ data: T[]; total: number; page: number }>;

type Deleter = () => Promise<void>;

declare module 'mongoose' {
  interface Model<T> {
    paginate: Paginator<T>;
    delete: Deleter;
  }

  interface Models {
    ApiKey: Model<IApiKey>;
    Dataset: Model<IDataset>;
    Notification: Model<INotification>;
    Query: Model<IQuery>;
    Token: Model<IToken>;
    User: Model<IUser>;
  }
}
