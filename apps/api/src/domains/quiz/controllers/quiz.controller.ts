import status from 'http-status';
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import auth from '@nifty/api/middlewares/auth';
import {
  openaiRequestHandler,
  openaiRequest,
} from '@nifty/api/lib/openai-request';
import { CustomException } from '@nifty/api/exceptions';
import { PaginationParams } from '@nifty/api/types';

import {
  setPermissions,
  Permission,
  gradeQuestions,
  countTokens,
  createMultipleChoiceQuizGenerationPrompt,
  createFreeResponseQuizGenerationPrompt,
  gradeAnswers,
} from '@nifty/api/util';
import { authGuard } from '@nifty/api/middlewares/guards/auth';
import {
  SubmissionService,
  QuizService,
  QuizCollaboratorService,
  NoteCollaboratorService,
  NoteService,
} from '@nifty/api/domains';
import { BINDING } from '../../binding';
import { ExpressResponse } from '../../dto';
import type {
  CreateQuizRequestBody,
  CreateQuizResponse,
  CreateQuizSubmissionRequestBody,
  CreateQuizSubmissionResponse,
  DeleteQuizByIdRequestParams,
  DeleteQuizByIdResponse,
  GetQuizByIdRequestParams,
  GetQuizByIdResponse,
  GetQuizSubmissionByIdResponse,
  GetQuizSubmissionsRequestParams,
  GetQuizSubmissionsResponse,
  GetQuizzesResponse,
} from '@nifty/api/domains/quiz/dto';

@controller('/v1/quizzes')
export class QuizController {
  constructor(
    @inject(BINDING.QUIZ_SERVICE)
    private quizService: QuizService,
    @inject(BINDING.QUIZ_COLLABORATOR_SERVICE)
    private quizCollaboratorService: QuizCollaboratorService,
    @inject(BINDING.SUBMISSION_SERVICE)
    private submissionService: SubmissionService,
    @inject(BINDING.NOTE_COLLABORATOR_SERVICE)
    private noteCollaboratorService: NoteCollaboratorService,
    @inject(BINDING.NOTE_SERVICE)
    private noteService: NoteService
  ) {}

  @httpGet('/:id', auth())
  @authGuard()
  async getQuiz(
    req: Request,
    res: Response
  ): ExpressResponse<GetQuizByIdResponse> {
    const userId = res.locals.user._id;
    const quizId = Number(req.params.id) as GetQuizByIdRequestParams;

    const hasPermission =
      await this.quizCollaboratorService.userHasPermissionToQuiz({
        quizId,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermission) {
      throw new CustomException(
        'You do not have permission to read this quiz.',
        status.FORBIDDEN
      );
    }

    const quiz = await this.quizService.getQuizById({
      id: quizId,
      select: '*',
    });

    return res.status(status.OK).json({ data: quiz });
  }

  @httpGet('/', auth())
  async getQuizzes(
    req: Request,
    res: Response
  ): ExpressResponse<GetQuizzesResponse> {
    const userId = res.locals.user._id;
    const { limit, cursor } = req.query as PaginationParams;

    const cursorDate = cursor ? new Date(cursor) : undefined;
    const quizzes = await this.quizCollaboratorService.paginateQuizzesByUserId({
      userId,
      select: '*',
      limit: Number(limit),
      cursor: cursorDate,
    });

    return res.status(status.OK).json({ data: quizzes });
  }

  @httpPost('/', auth())
  async createQuiz(
    req: Request,
    res: Response
  ): ExpressResponse<CreateQuizResponse> {
    const userId = res.locals.user._id;
    const values = req.body as CreateQuizRequestBody;
    const noteId = values.noteId;

    const hasPermissionToNote =
      await this.noteCollaboratorService.userHasPermissionToNote({
        noteId,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermissionToNote) {
      throw new CustomException(
        'You do not have permission to create a quiz for this note.',
        status.FORBIDDEN
      );
    }

    const note = await this.noteService.getNoteById({
      id: noteId,
      select: ['content'],
    });

    // generate selected questions
    const [multipleChoice, freeResponse] = await Promise.all([
      openaiRequest({
        payload: note.content,
        generator: openaiRequestHandler.multipleChoiceQuizGenerator,
        errorMessage: 'Quiz could not be generated from note',
        disabled: !values.multipleChoiceActivated,
      }),
      openaiRequest({
        payload: note.content,
        generator: openaiRequestHandler.freeResponseQuizGenerator,
        errorMessage: 'Quiz could not be generated from note',
        disabled: !values.freeResponseActivated,
      }),
    ]);

    const { quiz } = await this.quizService.createQuizAndCollaborator({
      userId,
      noteId,
      values: { ...values, createdBy: userId },
      questions: {
        multipleChoice: multipleChoice || [],
        freeResponse: freeResponse || [],
      },
      collabortorPermissions: Permission.ReadWriteDelete,
    });

    return res.status(status.CREATED).json({ data: quiz });
  }

  @httpPost('/:id/remix', auth())
  async remixQuiz(
    req: Request,
    res: Response
  ): ExpressResponse<CreateQuizRemixResponse> {
    // @TODO
    // const createdBy = res.locals.user._id;
    // const body: QuizCreateRequest = req.body;
    // const quizId = req.params.id;
    // const noteId = body.note;
    //
    return res.status(status.CREATED).json({ data: [] });
  }

  @httpDelete('/:id', auth())
  async deleteQuizById(
    req: Request,
    res: Response
  ): ExpressResponse<DeleteQuizByIdResponse> {
    const id = Number(req.params.id) as DeleteQuizByIdRequestParams;
    const userId = res.locals.user._id;

    const hasPermission =
      await this.quizCollaboratorService.userHasPermissionToQuiz({
        quizId: id,
        userId,
        permission: Permission.ReadWriteDelete,
      });

    if (!hasPermission) {
      throw new CustomException(
        'You do not have permission to delete this quiz.',
        status.FORBIDDEN
      );
    }

    await this.quizService.deleteQuizById(id);

    res.status(status.NO_CONTENT).json();
  }

  @httpPost('/:id/submissions', auth())
  async submitQuiz(
    req: Request,
    res: Response
  ): ExpressResponse<CreateQuizSubmissionResponse> {
    const userId = res.locals.user.id as number;
    const quizId = Number(req.params.id);
    const { answers, ...values } = req.body as CreateQuizSubmissionRequestBody;

    // validate access to quiz
    const hasPermission =
      await this.quizCollaboratorService.userHasPermissionToQuiz({
        quizId,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermission) {
      throw new CustomException(
        'You do not have permission to submit to this quiz.',
        status.FORBIDDEN
      );
    }

    // grading answers
    const { multipleChoiceQuestions, freeResponseQuestions } =
      await this.quizService.getQuizQuestionsById(quizId);

    const assessed = await gradeAnswers({
      questions: {
        multipleChoice: multipleChoiceQuestions,
        freeResponse: freeResponseQuestions,
      },
      answers,
    });

    // create submission and link answers
    const submission = await this.submissionService.createSubmission({
      values: {
        ...values,
        createdBy: userId,
        quizId,
        score: assessed.score,
        totalCorrect: assessed.totalCorrect,
        totalIncorrect: assessed.totalIncorrect,
        totalQuestions: assessed.totalQuestions,
        totalUnanswered: assessed.totalUnanswered,
      },
      answers: {
        freeResponse: assessed.freeResponse.grades,
        multipleChoice: assessed.multipleChoice.grades,
      },
    });

    return res.status(status.CREATED).json({ data: submission });
  }

  @httpGet('/submissions/:id', auth())
  async getSubmission(
    req: Request,
    res: Response
  ): ExpressResponse<GetQuizSubmissionByIdResponse> {
    const userId = res.locals.user._id;
    const submissionId = Number(req.params.id);

    const submission = await this.submissionService.getSubmissionById({
      id: submissionId,
      select: '*',
    });

    // validate permission to quiz
    const hasPermission = submission?.createdBy === userId;
    if (!hasPermission) {
      throw new CustomException(
        'You do not have permission to read this submission.',
        status.FORBIDDEN
      );
    }

    return res.status(status.OK).json({ data: submission });
  }

  @httpGet('/:id/submissions', auth())
  async getSubmissions(
    req: Request,
    res: Response
  ): ExpressResponse<GetQuizSubmissionsResponse> {
    const userId = res.locals.user._id;
    const quizId = Number(req.params.id) as GetQuizSubmissionsRequestParams;
    const { limit, cursor } = req.query as GetQuizSubmissionsRequestQuery;

    // validate permission to quiz
    const hasPermission =
      await this.quizCollaboratorService.userHasPermissionToQuiz({
        quizId,
        userId,
        permission: Permission.Read,
      });

    if (!hasPermission) {
      throw new CustomException(
        'You do not have permission to read submissions for this quiz.',
        status.FORBIDDEN
      );
    }

    const cursorDate = cursor ? new Date(cursor) : undefined;
    const submissions =
      await this.submissionService.paginateSubmissionsByQuizId({
        quizId,
        limit: Number(limit),
        cursor: cursorDate,
      });

    return res.status(status.OK).json({ data: submissions });
  }
}
