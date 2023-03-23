import { RequestHandler } from 'express';
import mongoose from 'lib/mongoose';
declare type RestHandlers = {
    create: RequestHandler;
    retrieve: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
    list: RequestHandler;
};
declare const restHandlers: <T>(Schema: mongoose.Model<T, {}, {}, {}, any>, omitProperties?: (keyof T)[]) => RestHandlers;
export default restHandlers;
//# sourceMappingURL=rest-handlers.d.ts.map