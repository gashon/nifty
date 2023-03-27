import { Container } from 'inversify';
import { BaseRepositoryFactory, IBaseRepositoryFactory } from "../lib/repository-base";
import {
  IUserController,
  IUserService,
  UserController,
  UserService,
  TYPES as USER_TYPES,
} from '@/domains/user';
import {
  IDirectoryController,
  IDirectoryService,
  DirectoryController,
  DirectoryService,
  TYPES as DIRECTORY_TYPES,
} from "@/domains/directory"
import {
  ICollaboratorController,
  ICollaboratorService,
  CollaboratorController,
  CollaboratorService,
  TYPES as COLLABORATOR_TYPES,
} from '@/domains/collaborator';

const container = new Container();

container.bind<IBaseRepositoryFactory>("RepositoryGetter").to(BaseRepositoryFactory);

container.bind<IUserService>(USER_TYPES.UserService).to(UserService);
container.bind<IUserController>(USER_TYPES.UserController).to(UserController);

container.bind<IDirectoryService>(DIRECTORY_TYPES.DirectoryService).to(DirectoryService);
container.bind<IDirectoryController>(DIRECTORY_TYPES.DirectoryController).to(DirectoryController);

container.bind<ICollaboratorService>(COLLABORATOR_TYPES.CollaboratorService).to(CollaboratorService);
container.bind<ICollaboratorController>(COLLABORATOR_TYPES.CollaboratorController).to(CollaboratorController);

export { container };