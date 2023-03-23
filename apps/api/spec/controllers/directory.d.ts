import * as express from 'express';
import { IDirectory, DirectoryCreateRequest, DirectoryListResponse } from "lib/models/directory";
import { Controller } from 'tsoa';
declare class DirectoryController extends Controller {
    create(body: DirectoryCreateRequest, req: express.Request, res: express.Response, next: express.NextFunction): Promise<IDirectory>;
    retrieve(id: string, query: any, req: express.Request, res: express.Response, next: express.NextFunction): Promise<IDirectory>;
    update(id: string, body: DirectoryCreateRequest, req: express.Request, res: express.Response, next: express.NextFunction): Promise<IDirectory>;
    delete(id: string, req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    list(query: any, req: express.Request, res: express.Response, next: express.NextFunction): Promise<DirectoryListResponse>;
}
declare const _default: DirectoryController;
export default _default;
//# sourceMappingURL=directory.d.ts.map