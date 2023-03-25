import * as express from 'express';
import { RequestHandler } from 'express';
import Directory, {
  IDirectory,
  DirectoryCreateRequest,
  DirectoryListResponse,
} from "@nifty/server-lib/models/directory";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OperationId,
  Patch,
  Path,
  Post,
  Query,
  Response,
  Route,
  Tags,
} from 'tsoa';
import restHandlers from '../helpers/rest-handlers';

const handlers = restHandlers<IDirectory>(Directory);

@Route('directories')
@Tags('Directory')
class DirectoryController extends Controller {
  @Post()
  @OperationId('directory_create')
  @Response<any>(201, 'Created')
  @Response(400, 'Bad Request')
  @Response(401, 'Unauthorized')
  public async create(
    @Inject() req: express.Request,
    @Inject() res: express.Response,
    @Inject() next: express.NextFunction,
    @Body() body?: DirectoryCreateRequest
  ): Promise<any> {
    return handlers.create(req, res, next);
  }

  @Get('{id}')
  @OperationId('directory_retrieve')
  @Response<IDirectory>(200, 'OK')
  @Response(400, 'Bad Request')
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  public async retrieve(
    @Inject() req: express.Request,
    @Inject() res: express.Response,
    @Inject() next: express.NextFunction,
    @Path() id?: string,
    @Query() expand?: any,
  ): Promise<any> {
    return handlers.retrieve(req, res, next);
  }

  @Patch('{id}')
  @OperationId('directory_update')
  @Response<IDirectory>(200, 'OK')
  @Response(400, 'Bad Request')
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  public async update(
    @Inject() req: express.Request,
    @Inject() res: express.Response,
    @Inject() next: express.NextFunction,
    @Path() id?: string,
    @Body() body?: DirectoryCreateRequest,
  ): Promise<any> {
    return handlers.update(req, res, next);
  }

  @Delete('{id}')
  @OperationId('directory_delete')
  @Response(204, 'No Content')
  @Response(400, 'Bad Request')
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  public async delete(
    @Inject() req: express.Request,
    @Inject() res: express.Response,
    @Inject() next: express.NextFunction,
    @Path() id?: string,
  ): Promise<any> {
    return handlers.delete(req, res, next);
  }

  @Get()
  @OperationId('directory_list')
  @Response<DirectoryListResponse>(200, 'OK')
  @Response(400, 'Bad Request')
  @Response(401, 'Unauthorized')
  public async list(
    @Inject() req: express.Request,
    @Inject() res: express.Response,
    @Inject() next: express.NextFunction,
    @Query() limit?: number,
    @Query() page?: number,
    @Query() sort?: number,
    @Query() expand?: string
  ): Promise<any> {
    return handlers.list(req, res, next);
  }
}
export default new DirectoryController();