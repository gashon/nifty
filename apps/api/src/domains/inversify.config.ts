import { Container } from 'inversify';

import { IUserController, UserController, USER_TYPES } from '@/domains/user';
import {
  IDirectoryController,
  DirectoryController,
  DIRECTORY_TYPES,
} from '@/domains/directory';
import {
  ICollaboratorController,
  CollaboratorController,
  COLLABORATOR_TYPES,
} from '@/domains/collaborator';
import { INoteController, NoteController, NOTE_TYPES } from '@/domains/note';
import { IQuizController, QuizController, QUIZ_TYPES } from '@/domains/quiz';
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

const container = new Container();

container.bind<UserModel>(USER_TYPES.MODEL).toDynamicValue(() => User);
container.bind<IUserController>(USER_TYPES.CONTROLLER).to(UserController);

container
  .bind<DirectoryModel>(DIRECTORY_TYPES.MODEL)
  .toDynamicValue(() => Directory);
container
  .bind<IDirectoryController>(DIRECTORY_TYPES.CONTROLLER)
  .to(DirectoryController);

container
  .bind<CollaboratorModel>(COLLABORATOR_TYPES.MODEL)
  .toDynamicValue(() => Collaborator);
container
  .bind<ICollaboratorController>(COLLABORATOR_TYPES.CONTROLLER)
  .to(CollaboratorController);

container.bind<NoteModel>(NOTE_TYPES.MODEL).toDynamicValue(() => Note);
container.bind<INoteController>(NOTE_TYPES.CONTROLLER).to(NoteController);

container.bind<QuizModel>(QUIZ_TYPES.MODEL).toDynamicValue(() => Quiz);
container.bind<IQuizController>(QUIZ_TYPES.CONTROLLER).to(QuizController);

container
  .bind<SubmissionModel>(SUBMISSION_TYPES.MODEL)
  .toDynamicValue(() => Submission);

export { container };
