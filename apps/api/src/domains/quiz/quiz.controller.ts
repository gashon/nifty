import status from 'http-status';
import { controller, httpGet, httpPost, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import auth from '@/middlewares/auth';
import { generateQuizFromNote, shuffleQuiz } from "@/util"
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
import { CollaboratorDocument } from '@nifty/server-lib/models/collaborator';

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

    // validate permissions
    const collaborators = await quiz.populate('collaborators').execPopulate();
    const collaborator = collaborators.collaborators.find((collaborator: any) => collaborator.user_id === userId);
    if (!collaborator)
      throw new CustomException('You do not have access to this quiz', status.FORBIDDEN);

    res.status(status.OK).json({ data: quiz });
  }

  @httpGet('/', auth())
  async getQuizzes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const query = { ...req.query } as PaginationParams;

    const condition: FilterQuery<CollaboratorDocument> = {
      // @ts-ignore
      deleted_at: { $exists: false },
      type: "quiz",
      user: userId
    }

    const collaborators = await this.collaboratorService.paginateCollaborators(condition, query);
    if (!collaborators?.data || collaborators.data.length == 0) {
      res.status(status.OK).json({ data: [] });
      return;
    }

    const quizzes = await this.quizService.findQuizzesByIds(collaborators.data.map(collaborator => collaborator.foreign_key));

    res.status(status.OK).json({ data: quizzes });
  }

  @httpPost("/", auth())
  async createQuiz(req: Request, res: Response): Promise<Response<QuizCreateResponse>> {
    const createdBy = res.locals.user._id;
    const noteId = req.body.note;

    // validate note exists
    const note = await this.noteService.findNoteById(noteId);
    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    // validate user has access to directory
    const collaborator = await this.collaboratorService.findCollaboratorByNoteIdAndUserId(note.id, createdBy);
    if (!collaborator)
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    // create the quiz
    const [quizCollaborator, stringifiedQuiz] = await Promise.all([
      this.collaboratorService.createCollaborator(createdBy, { user: createdBy, type: "quiz", permissions: ['r', 'w', 'd'] }),
      generateQuizFromNote(note.content)
    ]);

    if (!stringifiedQuiz)
      throw new CustomException('Quiz could not be generated from note', status.BAD_REQUEST);

    const quizContent = JSON.parse(stringifiedQuiz).questions
    // randomize the order of the questions and mark the correct_index
    const randomizedQuiz = shuffleQuiz(quizContent);
    const quiz = await this.quizService.createQuiz(createdBy, { questions: randomizedQuiz, note: noteId, collaborators: [quizCollaborator.id] } as QuizCreateRequest);

    quizCollaborator.set({ foreign_key: quiz.id });
    quizCollaborator.save();

    return res.status(status.CREATED).json({ data: quiz });
  }

  @httpDelete("/:id", auth())
  async deleteQuizById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;

    // validate quiz exists
    const quiz = await this.quizService.findQuizById(id);
    if (!quiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorService.findCollaboratorByForeignKeyAndUserId(quiz.id, userId);
    // validate user has access to quiz
    if (!collaborator || !quiz.collaborators.includes(collaborator.id))
      throw new CustomException('You do not have access to this quiz', status.FORBIDDEN);

    // delete quiz
    await this.quizService.deleteQuizById(id);

    res.status(status.NO_CONTENT).json();
  }


}