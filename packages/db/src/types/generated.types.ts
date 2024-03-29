import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type TokenStrategy =
  | 'email'
  | 'facebook'
  | 'github'
  | 'google'
  | 'invite'
  | 'refresh';

export interface Collaborator {
  createdAt: Generated<Timestamp>;
  createdBy: number;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  lastViewedAt: Timestamp | null;
  permissions: number;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface Directory {
  alias: string | null;
  createdAt: Generated<Timestamp>;
  createdBy: number;
  credits: number | null;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  name: string;
  parentId: number | null;
  updatedAt: Generated<Timestamp>;
}

export interface DirectoryCollaborator {
  collaboratorId: number;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  directoryId: number;
  id: Generated<number>;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface Note {
  content: Generated<string>;
  createdAt: Generated<Timestamp>;
  createdBy: number;
  deletedAt: Timestamp | null;
  description: string;
  directoryId: number | null;
  id: Generated<number>;
  imgUrl: string | null;
  publicPermissions: number;
  title: string;
  updatedAt: Generated<Timestamp>;
}

export interface NoteCollaborator {
  collaboratorId: number;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  noteId: number;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface NoteTag {
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  noteId: number;
  tag: string;
  updatedAt: Generated<Timestamp>;
}

export interface Quiz {
  createdAt: Generated<Timestamp>;
  createdBy: number;
  deletedAt: Timestamp | null;
  freeResponseActivated: boolean;
  id: Generated<number>;
  multipleChoiceActivated: boolean;
  noteId: number;
  title: string;
  updatedAt: Generated<Timestamp>;
}

export interface QuizCollaborator {
  collaboratorId: number;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  quizId: number;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface QuizQuestionFreeResponse {
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  question: string;
  quizId: number;
  updatedAt: Generated<Timestamp>;
}

export interface QuizQuestionMultipleChoice {
  answers: string[];
  correctIndex: number;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  question: string;
  quizId: number;
  updatedAt: Generated<Timestamp>;
}

export interface RefreshToken {
  createdAt: Generated<Timestamp>;
  createdByIp: string;
  createdByUserAgent: string;
  deletedAt: Timestamp | null;
  expiresAt: Timestamp;
  id: Generated<number>;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface Submission {
  createdAt: Generated<Timestamp>;
  createdBy: number;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  quizId: number;
  score: number;
  timeTaken: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalQuestions: number;
  totalUnanswered: number;
  updatedAt: Generated<Timestamp>;
}

export interface SubmissionAnswerFreeResponse {
  answerText: string | null;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  feedbackText: string | null;
  id: Generated<number>;
  questionId: number;
  submissionId: number;
  updatedAt: Generated<Timestamp>;
}

export interface SubmissionAnswerMultipleChoice {
  answerIndex: number | null;
  correctIndex: number | null;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  id: Generated<number>;
  isCorrect: boolean | null;
  questionId: number;
  submissionId: number;
  updatedAt: Generated<Timestamp>;
}

export interface Token {
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  expiresAt: Timestamp;
  id: Generated<number>;
  strategy: TokenStrategy;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface User {
  avatarUrl: string | null;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  email: string;
  firstName: string | null;
  id: Generated<number>;
  lastLogin: Timestamp | null;
  lastName: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  collaborator: Collaborator;
  directory: Directory;
  directoryCollaborator: DirectoryCollaborator;
  note: Note;
  noteCollaborator: NoteCollaborator;
  noteTag: NoteTag;
  quiz: Quiz;
  quizCollaborator: QuizCollaborator;
  quizQuestionFreeResponse: QuizQuestionFreeResponse;
  quizQuestionMultipleChoice: QuizQuestionMultipleChoice;
  refreshToken: RefreshToken;
  submission: Submission;
  submissionAnswerFreeResponse: SubmissionAnswerFreeResponse;
  submissionAnswerMultipleChoice: SubmissionAnswerMultipleChoice;
  token: Token;
  user: User;
}
