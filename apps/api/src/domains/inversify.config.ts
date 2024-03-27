import { Container } from 'inversify';

import type { KysleyDB } from '@nifty/common/types/pg';
import { db } from '@nifty/common/db';

import {
  IUserController,
  UserController,
  USER_TYPES,
} from '@nifty/api/domains/user';
import {
  IDirectoryController,
  DirectoryController,
  DIRECTORY_TYPES,
} from '@nifty/api/domains/directory';
import {
  ICollaboratorController,
  CollaboratorController,
  COLLABORATOR_TYPES,
} from '@nifty/api/domains/collaborator';
import {
  INoteController,
  NoteController,
  NOTE_TYPES,
} from '@nifty/api/domains/note';
import {
  IQuizController,
  QuizController,
  QUIZ_TYPES,
} from '@nifty/api/domains/quiz';
import { SUBMISSION_TYPES } from './submission/types';

import Note, { NoteModel } from '@nifty/server-lib/models/note';
import Directory, { DirectoryModel } from '@nifty/server-lib/models/directory';
import Collaborator, {
  CollaboratorModel,
} from '@nifty/server-lib/models/collaborator';
import Quiz, { QuizModel } from '@nifty/server-lib/models/quiz';
import Submission, {
  SubmissionModel,
} from '@nifty/server-lib/models/submission';
import User, { type UserModel } from '@nifty/server-lib/models/user';
import {
  DirectoryRepository,
  DirectoryCollaboratorRepository,
  CollaboratorRepository,
  NoteRepository,
  NoteCollaboratorRepository,
  NoteService,
  NoteCollaboratorService,
  DirectoryService,
  DirectoryCollaboratorService,
} from '@nifty/api/domains';
import { BINDING } from '@nifty/api/domains/binding';

const container = new Container();

container.bind<KysleyDB>(BINDING.DB).toConstantValue(db);

container.bind<UserModel>(USER_TYPES.MODEL).toDynamicValue(() => User);
container.bind<IUserController>(USER_TYPES.CONTROLLER).to(UserController);

// Directory
container
  .bind<InstanceType<typeof DirectoryService>>(BINDING.DIRECTORY_SERVICE)
  .to(DirectoryService);
container
  .bind<InstanceType<typeof DirectoryCollaboratorService>>(
    BINDING.DIRECTORY_COLLABORATOR_SERVICE
  )
  .to(DirectoryCollaboratorService);
container
  .bind<InstanceType<typeof DirectoryRepository>>(BINDING.DIRECTORY_REPOSITORY)
  .to(DirectoryRepository);
container
  .bind<InstanceType<typeof DirectoryCollaboratorRepository>>(
    BINDING.DIRECTORY_COLLABORATOR_REPOSITORY
  )
  .to(DirectoryCollaboratorRepository);
container
  .bind<DirectoryModel>(DIRECTORY_TYPES.MODEL)
  .toDynamicValue(() => Directory);
container
  .bind<IDirectoryController>(DIRECTORY_TYPES.CONTROLLER)
  .to(DirectoryController);

container
  .bind<InstanceType<typeof CollaboratorRepository>>(
    BINDING.COLLABORATOR_REPOSITORY
  )
  .to(CollaboratorRepository);
container
  .bind<CollaboratorModel>(COLLABORATOR_TYPES.MODEL)
  .toDynamicValue(() => Collaborator);
container
  .bind<ICollaboratorController>(COLLABORATOR_TYPES.CONTROLLER)
  .to(CollaboratorController);

// Note
container
  .bind<InstanceType<typeof NoteService>>(BINDING.NOTE_SERVICE)
  .to(NoteService);
container
  .bind<InstanceType<typeof NoteCollaboratorService>>(
    BINDING.NOTE_COLLABORATOR_SERVICE
  )
  .to(NoteCollaboratorService);
container
  .bind<InstanceType<typeof NoteRepository>>(BINDING.NOTE_REPOSITORY)
  .to(NoteRepository);
container
  .bind<InstanceType<typeof NoteCollaboratorRepository>>(
    BINDING.NOTE_COLLABORATOR_REPOSITORY
  )
  .to(NoteCollaboratorRepository);
container.bind<NoteModel>(NOTE_TYPES.MODEL).toDynamicValue(() => Note);
container.bind<INoteController>(NOTE_TYPES.CONTROLLER).to(NoteController);

container.bind<QuizModel>(QUIZ_TYPES.MODEL).toDynamicValue(() => Quiz);
container.bind<IQuizController>(QUIZ_TYPES.CONTROLLER).to(QuizController);

container
  .bind<SubmissionModel>(SUBMISSION_TYPES.MODEL)
  .toDynamicValue(() => Submission);

export { container };
