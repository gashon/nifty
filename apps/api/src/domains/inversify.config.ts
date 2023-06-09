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
import {
  INoteController,
  INoteService,
  NoteController,
  NoteService,
  NOTE_TYPES,
} from '@/domains/note';
import {
  IQuizController,
  IQuizService,
  QuizController,
  QuizService,
  QUIZ_TYPES,
} from '@/domains/quiz';

const container = new Container();

// deprecated
container.bind<IBaseRepositoryFactory>("RepositoryGetter").to(BaseRepositoryFactory);

container.bind<IUserService>(USER_TYPES.SERVICE).to(UserService);
container.bind<IUserController>(USER_TYPES.CONTROLLER).to(UserController);

container.bind<IDirectoryService>(DIRECTORY_TYPES.SERVICE).to(DirectoryService);
container.bind<IDirectoryController>(DIRECTORY_TYPES.CONTROLLER).to(DirectoryController);

container.bind<ICollaboratorService>(COLLABORATOR_TYPES.SERVICE).to(CollaboratorService);
container.bind<ICollaboratorController>(COLLABORATOR_TYPES.CONTROLLER).to(CollaboratorController);

container.bind<INoteService>(NOTE_TYPES.SERVICE).to(NoteService);
container.bind<INoteController>(NOTE_TYPES.CONTROLLER).to(NoteController);

container.bind<IQuizService>(QUIZ_TYPES.SERVICE).to(QuizService);
container.bind<IQuizController>(QUIZ_TYPES.CONTROLLER).to(QuizController);

export { container };