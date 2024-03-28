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
  COLLABORATOR_TYPES,
} from '@nifty/api/domains/collaborator';
import {
  INoteController,
  NoteController,
  NOTE_TYPES,
} from '@nifty/api/domains/note';
import {
  IQuizController,
  QuizCollaboratorRepository,
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
  UserRepository,
  UserService,
  QuizService,
  QuizRepository,
  SubmissionService,
  SubmissionRepository,
} from '@nifty/api/domains';
import { BINDING } from '@nifty/api/domains/binding';
import { QuizCollaboratorService } from './quiz/services/quiz-collaborator.service';

const container = new Container();

container.bind<KysleyDB>(BINDING.DB).toConstantValue(db);

// User
container.bind<UserRepository>(BINDING.USER_REPOSITORY).to(UserRepository);
container.bind<UserService>(BINDING.USER_SERVICE).to(UserService);
container.bind<UserModel>(USER_TYPES.MODEL).toDynamicValue(() => User);
container.bind<IUserController>(USER_TYPES.CONTROLLER).to(UserController);

// Directory
container
  .bind<DirectoryService>(BINDING.DIRECTORY_SERVICE)
  .to(DirectoryService);
container
  .bind<DirectoryCollaboratorService>(BINDING.DIRECTORY_COLLABORATOR_SERVICE)
  .to(DirectoryCollaboratorService);
container
  .bind<DirectoryRepository>(BINDING.DIRECTORY_REPOSITORY)
  .to(DirectoryRepository);
container
  .bind<DirectoryCollaboratorRepository>(
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
  .bind<CollaboratorRepository>(BINDING.COLLABORATOR_REPOSITORY)
  .to(CollaboratorRepository);
container
  .bind<CollaboratorModel>(COLLABORATOR_TYPES.MODEL)
  .toDynamicValue(() => Collaborator);

// Note
container.bind<NoteService>(BINDING.NOTE_SERVICE).to(NoteService);
container
  .bind<NoteCollaboratorService>(BINDING.NOTE_COLLABORATOR_SERVICE)
  .to(NoteCollaboratorService);
container.bind<NoteRepository>(BINDING.NOTE_REPOSITORY).to(NoteRepository);
container
  .bind<NoteCollaboratorRepository>(BINDING.NOTE_COLLABORATOR_REPOSITORY)
  .to(NoteCollaboratorRepository);
container.bind<NoteModel>(NOTE_TYPES.MODEL).toDynamicValue(() => Note);
container.bind<INoteController>(NOTE_TYPES.CONTROLLER).to(NoteController);

// Quiz
container.bind<QuizService>(BINDING.QUIZ_SERVICE).to(QuizService);
container
  .bind<QuizCollaboratorService>(BINDING.QUIZ_COLLABORATOR_SERVICE)
  .to(QuizCollaboratorService);
container.bind<QuizRepository>(BINDING.QUIZ_REPOSITORY).to(QuizRepository);
container
  .bind<QuizCollaboratorRepository>(BINDING.QUIZ_COLLABORATOR_REPOSITORY)
  .to(QuizCollaboratorRepository);
container.bind<QuizModel>(QUIZ_TYPES.MODEL).toDynamicValue(() => Quiz);
container.bind<IQuizController>(QUIZ_TYPES.CONTROLLER).to(QuizController);

// Submission
container
  .bind<SubmissionService>(BINDING.SUBMISSION_SERVICE)
  .to(SubmissionService);
container
  .bind<SubmissionRepository>(BINDING.SUBMISSION_REPOSITORY)
  .to(SubmissionRepository);
container
  .bind<SubmissionModel>(SUBMISSION_TYPES.MODEL)
  .toDynamicValue(() => Submission);

export { container };
