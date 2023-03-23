import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { IUser } from '../user';
export declare type NotificationType = 'team.invite' | 'login';
export interface INotification extends Resource {
    user: IUser;
    type: NotificationType;
    data: {
        [key: string]: any;
    };
    emails: string[];
}
export declare type NotificationDocument = mongoose.Document<string, object, INotification>;
//# sourceMappingURL=types.d.ts.map