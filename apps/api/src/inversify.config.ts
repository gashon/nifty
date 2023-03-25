import { Container } from 'inversify';
import { BaseRepositoryFactory, IBaseRepositoryFactory } from "./domains/base/repository-factory";
import {
  IDirectoryController,
  IDirectoryService,
  IDirectoryRepository,
  DirectoryController,
  DirectoryService,
  DirectoryRepository,
  TYPES as DIRECTORY_TYPES,
} from './domains/directory';
import {
  IUserController,
  IUserService,
  IUserRepository,
  UserController,
  UserService,
  TYPES as USER_TYPES,
} from './domains/user';

const container = new Container();
const baseRepositoryFactory = new BaseRepositoryFactory();

container.bind<IBaseRepositoryFactory>("RepositoryFactory").to(BaseRepositoryFactory);

container.bind<IDirectoryService>(DIRECTORY_TYPES.DirectoryService).to(DirectoryService);
container.bind<IDirectoryRepository>(DIRECTORY_TYPES.DirectoryRepository).to(DirectoryRepository);
container.bind<IDirectoryController>(DIRECTORY_TYPES.DirectoryController).to(DirectoryController);

container.bind<IUserService>(USER_TYPES.UserService).to(UserService);
container.bind<IUserController>(USER_TYPES.UserController).to(UserController);

export { container };