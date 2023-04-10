import status from 'http-status';
import { controller, httpGet, httpPost, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@/middlewares/auth';
import { CustomException } from '@/exceptions';
import { QuizCreateRequest } from '@nifty/server-lib/models/quiz';
import { PaginationParams } from '@/types';
import {
  IQuizService,
  IQuizController,
} from "@/domains/quiz"
import {
  ICollaboratorService,
} from "@/domains/collaborator"
import { IDirectoryService } from '../directory';
import { QUIZ_TYPES, QuizCreateResponse } from '@/domains/quiz/types';
import { NOTE_TYPES } from '@/domains/note/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
import { DIRECTORY_TYPES } from '@/domains/directory/types';
import { INoteService } from '../note';

@controller('/v1/quizzes')
export class QuizController implements IQuizController {
  constructor(
    @inject(QUIZ_TYPES.SERVICE) private quizService: IQuizService,
    @inject(NOTE_TYPES.SERVICE) private noteService: INoteService,
    @inject(DIRECTORY_TYPES.SERVICE) private directoryService: IDirectoryService,
    @inject(COLLABORATOR_TYPES.SERVICE) private collaboratorService: ICollaboratorService) {
  }

  @httpGet('/:id', auth())
  async getQuiz(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const quiz = await this.quizService.findQuizById(req.params.id);

    if (!quiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    if (!quiz.collaborators.includes(userId))
      throw new CustomException('You do not have access to this quiz', status.FORBIDDEN);

    res.status(status.OK).json({ data: quiz });
  }

  @httpGet('/', auth())
  async getQuizzes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const directoryId = req.query.directory_id as string;

    // validate directory exists
    const directory = await this.directoryService.findDirectoryById(directoryId);
    if (!directory)
      throw new CustomException('Directory not found', status.NOT_FOUND);

    // validate user has access to directory
    const collaborator = await this.collaboratorService.findCollaboratorByDirectoryIdAndUserId(directory.id, userId);
    if (!collaborator)
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    const query = { ...req.query, directory_id: undefined } as PaginationParams;
    const quizzes = await this.quizService.paginateQuizzesByDirectoryId(directoryId, query);

    res.status(status.OK).json({ data: quizzes });
  }

  @httpPost("/", auth())
  async createQuiz(req: Request, res: Response): Promise<Response<QuizCreateResponse>> {
    const createdBy = res.locals.user._id;
    const noteId = req.body.note_id;

    // valdiate note exists
    const note = await this.noteService.findNoteById(noteId);
    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    // validate user has access to directory
    const collaborator = await this.collaboratorService.findCollaboratorByNoteIdAndUserId(note.id, createdBy);
    if (!collaborator)
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    // create the quiz
    const { id: quizCollaboratorId } = await this.collaboratorService.createCollaborator(createdBy, { user: createdBy, type: "quiz" });
    const quiz = await this.quizService.createQuiz(createdBy, { note: noteId, collaborators: [quizCollaboratorId] } as QuizCreateRequest);

    // add the quiz to the directory
    directory.set({ quizzes: [...directory.quizzes, quiz.id], collaborators: [...directory.collaborators] });
    await directory.save();

    return res.status(status.CREATED).json({ data: quiz });
  }

  @httpPatch("/:id", auth())
  async updateQuiz(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;
    const data = req.body;

    // validate quiz exists
    const quiz = await this.quizService.findQuizById(id);
    if (!quiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorByQuizIdAndUserId(quiz.id, userId);
    // validate user has access to quiz
    if (!collaborator || !quiz.collaborators.includes(collaborator.id))
      throw new CustomException('You do not have access to this quiz', status.FORBIDDEN);

    // update quiz
    const updatedQuiz = await this.quizService.updateQuizById(id, data);

    res.status(status.OK).json({ data: updatedQuiz });
  }

  @httpDelete("/:id", auth())
  async deleteQuizById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;

    // validate quiz exists
    const quiz = await this.quizService.findQuizById(id);
    if (!quiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorById(userId);
    // validate user has access to quiz
    if (!collaborator || !quiz.collaborators.includes(collaborator.id))
      throw new CustomException('You do not have access to this quiz', status.FORBIDDEN);

    // delete quiz
    await this.quizService.deleteQuizById(id);

    res.status(status.NO_CONTENT).json();
  }


}