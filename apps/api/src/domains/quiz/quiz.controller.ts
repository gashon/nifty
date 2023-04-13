import status from 'http-status';
import { controller, httpGet, httpPost, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import auth from '@/middlewares/auth';
import { openaiRequestHandler } from "@/lib/openai-request"
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
import { setPermissions, Permission } from '@/util';
import { SubmissionCreateRequest, ISubmissionAnswer } from '@nifty/server-lib/models/submission';
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

    let quiz = await this.quizService.findQuizById(req.params.id, true);
    if (!quiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    // validate permissions
    quiz = await quiz.populate('collaborators');
    const collaborator = quiz.collaborators.find((collaborator: any) => collaborator.user === userId);
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

    const { format, sendRequest, reformat } = openaiRequestHandler.quizGenerator;

    const noteContent = format(note.content);
    const [quizCollaborator, requestResult] = await Promise.all([
      this.collaboratorService.createCollaborator(createdBy, { user: createdBy, type: "quiz", permissions: setPermissions(Permission.ReadWriteDelete) }),
      sendRequest(noteContent)
    ]);

    if (!requestResult)
      throw new CustomException('Quiz could not be generated from note', status.BAD_REQUEST);

    let randomizedQuiz
    try {
      randomizedQuiz = reformat(requestResult);
    } catch (err) {
      throw new CustomException('Quiz could not be generated from note', status.BAD_REQUEST);
    }

    const quiz = await this.quizService.createQuiz(createdBy, { title: req.body.title, questions: randomizedQuiz, note: noteId, collaborators: [quizCollaborator.id] } as QuizCreateRequest);

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


  @httpPost('/:id/submissions', auth())
  async submitQuiz(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const quizId = req.params.id;
    const submissionAttributes: SubmissionCreateRequest = req.body;

    // validate quiz exists
    const quiz = await this.quizService.findQuizById(quizId);
    if (!quiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    // validate user has access to quiz
    if (userId !== quiz.created_by)
      throw new CustomException('You do not have access to this quiz', status.FORBIDDEN);

    // grading logic
    // todo move-me to util or service
    let stats = {
      total_correct: 0,
      total_incorrect: 0,
      total_unanswered: 0,
    }
    const submissionAnswers: ISubmissionAnswer[] = [];
    for (const answer of (submissionAttributes.answers ?? [])) {
      // find question
      const question = quiz.questions.find(question => question.id === answer.question_id);
      if (!question)
        throw new CustomException('Invalid question id', status.BAD_REQUEST);

      const isCorrect = answer.answer_index === question.correct_index;
      if (question.type === "multiple-choice") {
        if (isCorrect)
          stats.total_correct++;
        else
          stats.total_incorrect++;

        submissionAnswers.push({
          question_id: answer.question_id,
          type: question.type,
          answer_index: answer.answer_index,
          correct_index: question.correct_index!,
          is_correct: isCorrect,
        });
      }

    }
    stats.total_unanswered = quiz.questions.length - (stats.total_correct + stats.total_incorrect);

    const score = (stats.total_correct / quiz.questions.length) * 100;
    const submission = await this.quizService.submitQuiz(userId, {
      time_taken: -1,
      answers: submissionAnswers,
      total_questions: quiz.questions.length,
      ...stats,
      score
    });

    res.status(status.CREATED).json({ data: submission });
  }

  @httpGet('/:id/submissions', auth())
  async getSubmissions(req: Request, res: Response): Promise<void> {
    
  }

  @httpGet('/:id/submissions/:submissionId', auth())
  async getSubmission(req: Request, res: Response): Promise<void> {

  }
}