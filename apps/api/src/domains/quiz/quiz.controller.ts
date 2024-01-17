import status from 'http-status';
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import auth from '@/middlewares/auth';
import { openaiRequestHandler, openaiRequest } from '@/lib/openai-request';
import { CustomException } from '@/exceptions';
import { PaginationParams } from '@/types';
import { IQuizController } from '@/domains/quiz';
import { QUIZ_TYPES, QuizCreateResponse } from '@/domains/quiz/types';
import { NOTE_TYPES } from '@/domains/note/types';
import { COLLABORATOR_TYPES } from '@/domains/collaborator/types';
import { DIRECTORY_TYPES } from '@/domains/directory/types';
import {
  CollaboratorDocument,
  CollaboratorModel,
} from '@nifty/server-lib/models/collaborator';
import {
  setPermissions,
  Permission,
  gradeQuestions,
  countTokens,
  createMultipleChoiceQuizGenerationPrompt,
  createFreeResponseQuizGenerationPrompt,
} from '@/util';
import {
  SubmissionCreateRequest,
  ISubmissionAnswer,
  SubmissionModel,
} from '@nifty/server-lib/models/submission';
import { QuizCreateRequest, QuizModel } from '@nifty/server-lib/models/quiz';
import { SUBMISSION_TYPES } from '../submission/types';
import { NoteModel } from '@nifty/server-lib/models/note';
import { DirectoryModel } from '@nifty/server-lib/models/directory';

@controller('/v1/quizzes')
export class QuizController implements IQuizController {
  constructor(
    @inject(QUIZ_TYPES.MODEL) private quizModel: QuizModel,
    @inject(SUBMISSION_TYPES.MODEL) private submissionModel: SubmissionModel,
    @inject(NOTE_TYPES.MODEL) private noteModel: NoteModel,
    @inject(DIRECTORY_TYPES.MODEL)
    private directoryModel: DirectoryModel,
    @inject(COLLABORATOR_TYPES.MODEL)
    private collaboratorModel: CollaboratorModel
  ) {}

  @httpGet('/:id', auth())
  async getQuiz(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;

    // hide correct answer
    let quiz = await this.quizModel.findById(req.params.id, {
      'questions.correct_index': 0,
    });
    if (!quiz) throw new CustomException('Quiz not found', status.NOT_FOUND);

    // validate permissions
    quiz = await quiz.populate('collaborators');
    const collaborator = quiz.collaborators.find(
      (collaborator: any) => collaborator.user === userId
    );
    if (!collaborator)
      throw new CustomException(
        'You do not have access to this quiz',
        status.FORBIDDEN
      );

    res.status(status.OK).json({ data: quiz });
  }

  @httpGet('/', auth())
  async getQuizzes(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const query = { ...req.query } as PaginationParams<ICollaborator>;

    const condition: FilterQuery<CollaboratorDocument> = {
      deleted_at: { $exists: false },
      type: 'quiz',
      user: userId,
    };

    const collaborators = await this.collaboratorModel.paginate({
      ...condition,
      ...query,
    });
    if (!collaborators?.data || collaborators.data.length == 0) {
      res.status(status.OK).json({ data: [] });
      return;
    }

    const quizzes = await this.quizModel
      .find({
        _id: {
          $in: collaborators.data.map((collaborator) => collaborator.quiz),
        },
        deleted_at: null,
      })
      .sort({ created_at: -1 });

    res.status(status.OK).json({ data: quizzes });
  }

  @httpPost('/', auth())
  async createQuiz(
    req: Request,
    res: Response
  ): Promise<Response<QuizCreateResponse>> {
    const createdBy = res.locals.user._id;
    const body: QuizCreateRequest = req.body;
    const noteId = body.note;

    if (
      !body.question_type.multiple_choice &&
      !body.question_type.free_response
    )
      throw new CustomException(
        'Quiz must have at least one question type',
        status.BAD_REQUEST
      );

    // validate note exists
    const note = await this.noteModel.findById(noteId);
    if (!note) throw new CustomException('Note not found', status.NOT_FOUND);

    const numTokens = countTokens(note.content, 'text-davinci-003');
    if (numTokens > 2500)
      throw new CustomException(
        'Note must be less than 2500 words',
        status.BAD_REQUEST
      );

    if (numTokens < 25)
      throw new CustomException(
        'Note must be at least 25 words',
        status.BAD_REQUEST
      );

    // validate user has access to directory and note doesn't already have a quiz
    const [collaboratorsAggregation, prevQuiz] = await Promise.all([
      this.collaboratorModel.aggregate([
        {
          $match: {
            user: createdBy,
          },
        },
        {
          $lookup: {
            from: 'notes',
            localField: '_id',
            foreignField: 'collaborators',
            as: 'note',
          },
        },
        {
          $unwind: {
            path: '$note',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'note._id': noteId,
          },
        },
      ]),

      this.quizModel.findOne({ note: note.id, deleted_at: null }),
    ]);

    if (!collaboratorsAggregation[0])
      throw new CustomException(
        'You do not have access to this directory',
        status.FORBIDDEN
      );

    // generate quiz
    const [
      quizCollaborator,
      multipleChoiceResult,
      freeResponseResult,
      directory,
    ] = await Promise.all([
      this.collaboratorModel.create({
        user: createdBy,
        type: 'quiz',
        permissions: setPermissions(Permission.ReadWriteDelete),
        created_by: createdBy,
      }),
      body.question_type.multiple_choice &&
        openaiRequest({
          payload: note.content,
          generator: openaiRequestHandler.multipleChoiceQuizGenerator,
          errorMessage: 'Quiz could not be generated from note',
        }),
      body.question_type.free_response &&
        openaiRequest({
          payload: note.content,
          generator: openaiRequestHandler.freeResponseQuizGenerator,
          errorMessage: 'Quiz could not be generated from note',
        }),
      !req.body.title &&
        this.directoryModel.findOne({
          notes: {
            $in: [note.id],
          },
        }),
    ]);

    // set quiz title
    let title = req.body.title;
    if (!title && directory) {
      title = `${directory.name}: ${note.title}`;
    }

    // create quiz
    const quizQuestions = [
      ...(multipleChoiceResult || []),
      ...(freeResponseResult || []),
    ];
    const quiz = await this.quizModel.create({
      title,
      questions: quizQuestions,
      note: noteId,
      collaborators: [quizCollaborator.id],
      question_type: body.question_type,
      created_by: createdBy,
    });

    quizCollaborator.set({ quiz: quiz.id });
    quizCollaborator.save();

    return res.status(status.CREATED).json({ data: quiz });
  }

  @httpPost('/:id/remix', auth())
  async remixQuiz(
    req: Request,
    res: Response
  ): Promise<Response<QuizCreateResponse>> {
    const createdBy = res.locals.user._id;
    const body: QuizCreateRequest = req.body;
    const quizId = req.params.id;
    const noteId = body.note;

    if (
      !body.question_type.multiple_choice &&
      !body.question_type.free_response
    )
      throw new CustomException(
        'Quiz must have at least one question type',
        status.BAD_REQUEST
      );

    // validate note exists
    const note = await this.noteModel.findById(noteId);
    if (!note) throw new CustomException('Note not found', status.NOT_FOUND);

    // validate user has access to directory and note doesn't already have a quiz
    const [collaboratorAggregation, prevQuiz] = await Promise.all([
      this.collaboratorModel.aggregate([
        {
          $match: {
            user: createdBy,
          },
        },
        {
          $lookup: {
            from: 'notes',
            localField: '_id',
            foreignField: 'collaborators',
            as: 'note',
          },
        },
        {
          $unwind: {
            path: '$note',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'note._id': noteId,
          },
        },
      ]),
      this.quizModel.findById(quizId),
    ]);

    if (!collaboratorAggregation[0])
      throw new CustomException(
        'You do not have access to this directory',
        status.FORBIDDEN
      );

    if (!prevQuiz)
      throw new CustomException('Quiz not found', status.NOT_FOUND);

    const prevQuestionQuestions: string[] = prevQuiz.questions.map(
      ({ question }) => question
    );
    const questionListString = prevQuestionQuestions.join(', ');

    const numTokens = countTokens(
      `${note.content} ${questionListString}`,
      'text-davinci-003'
    );
    if (numTokens > 2500)
      throw new CustomException(
        'Note must be less than 2500 words',
        status.BAD_REQUEST
      );

    if (numTokens < 25)
      throw new CustomException(
        'Note must be at least 25 words',
        status.BAD_REQUEST
      );

    const remixMultipleChoiceGenerator =
      openaiRequestHandler.multipleChoiceQuizGenerator;
    remixMultipleChoiceGenerator.getPrompt = (payload: string) => {
      return createMultipleChoiceQuizGenerationPrompt(
        payload,
        questionListString
      );
    };

    const remixFreeResponseGenerator =
      openaiRequestHandler.freeResponseQuizGenerator;
    remixFreeResponseGenerator.getPrompt = (payload: string) => {
      return createFreeResponseQuizGenerationPrompt(
        payload,
        questionListString
      );
    };

    // generate quiz
    const [
      quizCollaborator,
      multipleChoiceResult,
      freeResponseResult,
      directory,
    ] = await Promise.all([
      this.collaboratorModel.create({
        user: createdBy,
        type: 'quiz',
        permissions: setPermissions(Permission.ReadWriteDelete),
        created_by: createdBy,
      }),
      body.question_type.multiple_choice &&
        openaiRequest({
          payload: note.content,
          generator: remixMultipleChoiceGenerator,
          errorMessage: 'Quiz could not be generated from note',
        }),
      body.question_type.free_response &&
        openaiRequest({
          payload: note.content,
          generator: remixFreeResponseGenerator,
          errorMessage: 'Quiz could not be generated from note',
        }),
      !req.body.title &&
        this.directoryModel.findOne({
          notes: {
            $in: [note.id],
          },
        }),
    ]);

    // set quiz title
    let title = req.body.title;
    if (!title && directory) {
      title = `${directory.name}: ${note.title} - Remix`;
    }

    // create quiz
    const quizQuestions = [
      ...(multipleChoiceResult || []),
      ...(freeResponseResult || []),
    ];
    const quiz = await this.quizModel.create({
      title,
      questions: quizQuestions,
      note: noteId,
      collaborators: [quizCollaborator.id],
      question_type: body.question_type,
      created_by: createdBy,
    });

    quizCollaborator.set({ quiz: quiz.id });
    quizCollaborator.save();

    return res.status(status.CREATED).json({ data: quiz });
  }

  @httpDelete('/:id', auth())
  async deleteQuizById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const userId = res.locals.user._id;

    // validate quiz exists
    const quiz = await this.quizModel.findById(id);
    if (!quiz) throw new CustomException('Quiz not found', status.NOT_FOUND);

    const collaborator = await this.collaboratorModel.findOne({
      user: userId,
      quiz: quiz.id,
    });

    // validate user has access to quiz
    if (!collaborator || !quiz.collaborators.includes(collaborator.id))
      throw new CustomException(
        'You do not have access to this quiz',
        status.FORBIDDEN
      );

    // delete quiz
    await this.quizModel.updateOne(
      { _id: id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    );

    res.status(status.NO_CONTENT).json();
  }

  @httpPost('/:id/submissions', auth())
  async submitQuiz(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const quizId = req.params.id;
    const submissionAttributes: SubmissionCreateRequest = req.body;

    // validate quiz exists
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) throw new CustomException('Quiz not found', status.NOT_FOUND);

    // validate user has access to quiz
    if (userId !== quiz.created_by)
      throw new CustomException(
        'You do not have access to this quiz',
        status.FORBIDDEN
      );

    // grading logic
    const submissionAnswers: ISubmissionAnswer[] = [];
    const questionsAndAnswers = quiz.questions.map((question) => {
      const answer = submissionAttributes.answers?.find(
        (answer) => answer.question_id === question.id
      );
      if (!answer)
        throw new CustomException('Invalid question id', status.BAD_REQUEST);

      return { question, answer };
    });

    const {
      multipleChoiceStats,
      multipleChoiceGrades,
      freeResponseStats,
      freeResponseGrades,
    } = await gradeQuestions(questionsAndAnswers);

    const stats = {
      total_correct:
        multipleChoiceStats.total_correct + freeResponseStats.total_correct,
      total_incorrect:
        multipleChoiceStats.total_incorrect + freeResponseStats.total_incorrect,
    };
    const score = (stats.total_correct / quiz.questions.length) * 100;

    const submission = await this.submissionModel.create({
      ...stats,
      quiz: quiz.id,
      time_taken: req.body.time_taken,
      grades: [...multipleChoiceGrades, ...freeResponseGrades],
      total_questions: quiz.questions.length,
      total_unanswered: quiz.questions.length - submissionAnswers.length,
      score,
      created_by: userId,
    });

    res.status(status.CREATED).json({ data: submission });
  }

  @httpGet('/submissions/:submissionId', auth())
  async getSubmission(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const submissionId = req.params.submissionId;

    let submission = await this.submissionModel.findById(submissionId);
    if (!submission)
      throw new CustomException('Submission not found', status.NOT_FOUND);

    // validate user has access to submission
    if (userId !== submission.created_by)
      throw new CustomException(
        'You do not have access to this submission',
        status.FORBIDDEN
      );

    submission = await submission.populate('quiz');
    res.status(status.OK).json({ data: submission });
  }

  @httpGet('/:id/submissions', auth())
  async getSubmissions(req: Request, res: Response): Promise<void> {}
}
