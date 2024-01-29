import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { IUser } from '../user';

export type NotificationType = 'team.invite' | 'login';

export interface INotification extends Resource {
  user: IUser;
  type: NotificationType;
  data: { [key: string]: any };
  emails: string[];
}

export type NotificationModel = mongoose.Model<INotification>;

export type NotificationDocument = mongoose.Document<
  string,
  object,
  INotification
>;
