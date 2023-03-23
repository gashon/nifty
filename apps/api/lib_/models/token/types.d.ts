/// <reference types="node" />
import mongoose from '../../mongoose';
import Resource from '../../utils/types/resource';
export declare type LoginStrategy = 'email' | 'google' | 'invite';
export interface IToken extends Resource {
    user: string;
    strategy: LoginStrategy;
    /** @ignore */
    getLoginLink: (redirect: string) => URL;
}
export declare type TokenDocument = mongoose.Document<string, object, IToken>;
//# sourceMappingURL=types.d.ts.map