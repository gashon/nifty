import { Container } from 'inversify';
import {
  BaseRepositoryFactory,
  IBaseRepositoryFactory,
} from '../lib/repository-base';
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
} from '@/domains/directory';
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
import Note, { NoteModel } from '@nifty/server-lib/models/note';
import Directory, { DirectoryModel } from '@nifty/server-lib/models/directory';
import Collaborator, {
  CollaboratorModel,
} from '@nifty/server-lib/models/collaborator';
import Quiz, { QuizModel } from '@nifty/server-lib/models/quiz';
import { SUBMISSION_TYPES } from './submission/types';
import Submission, {
  SubmissionModel,
} from '@nifty/server-lib/models/submission';
import User, { UserModel } from '@nifty/server-lib/models/user';

const container = new Container();

// deprecated
container
  .bind<IBaseRepositoryFactory>('RepositoryGetter')
  .to(BaseRepositoryFactory);

container.bind<IUserService>(USER_TYPES.SERVICE).to(UserService);
container.bind<UserModel>(USER_TYPES.MODEL).to(User);
container.bind<IUserController>(USER_TYPES.CONTROLLER).to(UserController);

container.bind<IDirectoryService>(DIRECTORY_TYPES.SERVICE).to(DirectoryService);
container.bind<DirectoryModel>(DIRECTORY_TYPES.MODEL).to(Directory);
container
  .bind<IDirectoryController>(DIRECTORY_TYPES.CONTROLLER)
  .to(DirectoryController);

container
  .bind<ICollaboratorService>(COLLABORATOR_TYPES.SERVICE)
  .to(CollaboratorService);
container.bind<CollaboratorModel>(COLLABORATOR_TYPES.MODEL).to(Collaborator);
container
  .bind<ICollaboratorController>(COLLABORATOR_TYPES.CONTROLLER)
  .to(CollaboratorController);

container.bind<INoteService>(NOTE_TYPES.SERVICE).to(NoteService);
container.bind<NoteModel>(NOTE_TYPES.MODEL).to(Note);
container.bind<INoteController>(NOTE_TYPES.CONTROLLER).to(NoteController);

container.bind<IQuizService>(QUIZ_TYPES.SERVICE).to(QuizService);
container.bind<QuizModel>(QUIZ_TYPES.MODEL).to(Quiz);
container.bind<IQuizController>(QUIZ_TYPES.CONTROLLER).to(QuizController);

container.bind<SubmissionModel>(SUBMISSION_TYPES.MODEL).to(Submission);

export { container };
