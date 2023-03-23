import { IApiKey } from 'lib/models/api-key';
import { INotification } from 'lib/models/notification';
import { IToken } from 'lib/models/token';
import { IUser } from 'lib/models/user';
import { ICollaborator } from 'lib/models/collaborator';
import { IDirectory } from 'lib/models/directory';
import { INote } from 'lib/models/note';

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
    Notification: Model<INotification>;
    Token: Model<IToken>;
    User: Model<IUser>;
    Collaborator: Model<ICollaborator>;
    Directory: Model<IDirectory>;
    Note: Model<INote>;
  }
}
