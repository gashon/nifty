import { Container } from 'inversify';
import { BaseRepositoryFactory, IBaseRepositoryFactory } from "../lib/repository-base";
import {
  IUserController,
  IUserService,
  UserController,
  UserService,
  USER_TYPES,
} from '@/domains/user';
import {
  IDirectoryController,
  IDirectoryService,
  DirectoryController,
  DirectoryService,
  DIRECTORY_TYPES,
} from "@/domains/directory"
import {
  ICollaboratorController,
  ICollaboratorService,
  CollaboratorController,
  CollaboratorService,
  COLLABORATOR_TYPES,
} from '@/domains/collaborator';

const container = new Container();

container.bind<IBaseRepositoryFactory>("RepositoryGetter").to(BaseRepositoryFactory);

container.bind<IUserService>(USER_TYPES.SERVICE).to(UserService);
container.bind<IUserController>(USER_TYPES.CONTROLLER).to(UserController);

container.bind<IDirectoryService>(DIRECTORY_TYPES.SERVICE).to(DirectoryService);
container.bind<IDirectoryController>(DIRECTORY_TYPES.CONTROLLER).to(DirectoryController);

container.bind<ICollaboratorService>(COLLABORATOR_TYPES.SERVICE).to(CollaboratorService);
container.bind<ICollaboratorController>(COLLABORATOR_TYPES.CONTROLLER).to(CollaboratorController);

export { container };