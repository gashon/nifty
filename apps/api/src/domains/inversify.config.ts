import { Container } from 'inversify';

import type { KysleyDB } from '@nifty/common/types/pg';
import { db } from '@nifty/common/db';
import {
  UserController,
  QuizController,
  NoteController,
  DirectoryController,
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
  QuizCollaboratorRepository,
} from '@nifty/api/domains';
import { BINDING } from '@nifty/api/domains/binding';
import { QuizCollaboratorService } from './quiz/services/quiz-collaborator.service';

const container = new Container();

container.bind<KysleyDB>(BINDING.DB).toConstantValue(db);

// User
container.bind<UserRepository>(BINDING.USER_REPOSITORY).to(UserRepository);
container.bind<UserService>(BINDING.USER_SERVICE).to(UserService);
container.bind<UserController>(BINDING.USER_CONTROLLER).to(UserController);

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
  .bind<DirectoryController>(BINDING.DIRECTORY_CONTROLLER)
  .to(DirectoryController);

container
  .bind<CollaboratorRepository>(BINDING.COLLABORATOR_REPOSITORY)
  .to(CollaboratorRepository);

// Note
container.bind<NoteService>(BINDING.NOTE_SERVICE).to(NoteService);
container
  .bind<NoteCollaboratorService>(BINDING.NOTE_COLLABORATOR_SERVICE)
  .to(NoteCollaboratorService);
container.bind<NoteRepository>(BINDING.NOTE_REPOSITORY).to(NoteRepository);
container
  .bind<NoteCollaboratorRepository>(BINDING.NOTE_COLLABORATOR_REPOSITORY)
  .to(NoteCollaboratorRepository);
container.bind<NoteController>(BINDING.NOTE_CONTROLLER).to(NoteController);

// Quiz
container.bind<QuizService>(BINDING.QUIZ_SERVICE).to(QuizService);
container
  .bind<QuizCollaboratorService>(BINDING.QUIZ_COLLABORATOR_SERVICE)
  .to(QuizCollaboratorService);
container.bind<QuizRepository>(BINDING.QUIZ_REPOSITORY).to(QuizRepository);
container
  .bind<QuizCollaboratorRepository>(BINDING.QUIZ_COLLABORATOR_REPOSITORY)
  .to(QuizCollaboratorRepository);
container.bind<QuizController>(BINDING.QUIZ_CONTROLLER).to(QuizController);

// Submission
container
  .bind<SubmissionService>(BINDING.SUBMISSION_SERVICE)
  .to(SubmissionService);
container
  .bind<SubmissionRepository>(BINDING.SUBMISSION_REPOSITORY)
  .to(SubmissionRepository);

export { container };
