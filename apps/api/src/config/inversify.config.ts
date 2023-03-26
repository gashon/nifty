import { Container } from 'inversify';
import { BaseRepositoryFactory, IBaseRepositoryFactory } from "../lib/repository-base";
import {
  IUserController,
  IUserService,
  UserController,
  UserService,
  TYPES as USER_TYPES,
} from '../domains/user';

const container = new Container();

container.bind<IBaseRepositoryFactory>("RepositoryGetter").to(BaseRepositoryFactory);

container.bind<IUserService>(USER_TYPES.UserService).to(UserService);
container.bind<IUserController>(USER_TYPES.UserController).to(UserController);

export { container };