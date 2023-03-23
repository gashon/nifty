import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';
import { IUser } from '../user';
export interface IApiKey extends Resource {
    user: IUser;
    name: string;
    key: string;
    last_used?: Date | number;
    /** @ignore */
    roll: () => Promise<this>;
}
export declare type ApiKeyDocument = mongoose.Document<string, object, IApiKey>;
export declare type ApiKeyCreateRequest = Partial<Expand<Pick<IApiKey, 'name'>>>;
export declare type ApiKeyListResponse = ListResponse<IApiKey>;
//# sourceMappingURL=types.d.ts.map