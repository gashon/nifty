import status from 'http-status';
import { controller, httpGet, httpPost, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import auth from '@/middlewares/auth';
import { openaiRequestHandler, openaiRequest } from "@/lib/openai-request"
import { CustomException } from '@/exceptions';
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
import { setPermissions, Permission, gradeQuestions } from '@/util';
import { SubmissionCreateRequest, ISubmissionAnswer, IQuizMultipleChoiceAnswer, IQuizFreeResponseAnswer, IMultipleChoiceSubmissionAnswer, IFreeResponseSubmissionAnswer, } from '@nifty/server-lib/models/submission';
import { QuizCreateRequest, IFreeResponseQuizQuestion, IMultipleChoiceQuizQuestion, IQuizMultipleChoiceQuestion, IQuizFreeResponseQuestion } from '@nifty/server-lib/models/quiz';

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
    const body: QuizCreateRequest = req.body;
    const noteId = body.note;

    // validate note exists
    const note = await this.noteService.findNoteById(noteId);
    if (!note)
      throw new CustomException('Note not found', status.NOT_FOUND);

    // validate user has access to directory
    const collaborator = await this.collaboratorService.findCollaboratorByNoteIdAndUserId(note.id, createdBy);
    if (!collaborator)
      throw new CustomException('You do not have access to this directory', status.FORBIDDEN);

    if (!body.question_type.multiple_choice && !body.question_type.free_response)
      throw new CustomException('Quiz must have at least one question type', status.BAD_REQUEST);

    // generate quiz
    const [quizCollaborator, multipleChoiceResult, freeResponseResult] = await Promise.all([
      this.collaboratorService.createCollaborator(createdBy, { user: createdBy, type: "quiz", permissions: setPermissions(Permission.ReadWriteDelete) }),
      body.question_type.multiple_choice && openaiRequest({
        payload: note.content,
        generator: openaiRequestHandler.multipleChoiceQuizGenerator,
        errorMessage: "Quiz could not be generated from note"
      }),
      body.question_type.free_response && openaiRequest({
        payload: note.content,
        generator: openaiRequestHandler.freeResponseQuizGenerator,
        errorMessage: "Quiz could not be generated from note"
      })
    ]);

    // create quiz 
    const quizQuestions = [...(multipleChoiceResult || []), ...(freeResponseResult || [])];
    const quiz = await this.quizService.createQuiz(createdBy, { title: req.body.title, questions: quizQuestions, note: noteId, collaborators: [quizCollaborator.id] });

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
    const submissionAnswers: ISubmissionAnswer[] = [];
    const questionsAndAnswers = quiz.questions.map((question) => {
      const answer = submissionAttributes.answers?.find(answer => answer.question_id === question.id);
      if (!answer)
        throw new CustomException('Invalid question id', status.BAD_REQUEST);

      return { question, answer }
    })

    const {
      multipleChoiceStats,
      multipleChoiceGrades,
      freeResponseStats,
      freeResponseGrades,
    } = await gradeQuestions(questionsAndAnswers);

    console.log("GOT", freeResponseGrades, freeResponseStats)

    const stats = {
      total_correct: multipleChoiceStats.total_correct + freeResponseStats.total_correct,
      total_incorrect: multipleChoiceStats.total_incorrect + freeResponseStats.total_incorrect,
    };
    const score = (stats.total_correct / quiz.questions.length) * 100;

    const submission = await this.quizService.submitQuiz(userId, {
      quiz: quiz.id,
      time_taken: req.body.time_taken,
      grades: [...multipleChoiceGrades, ...freeResponseGrades],
      total_questions: quiz.questions.length,
      total_unanswered: quiz.questions.length - submissionAnswers.length,
      score,
      ...stats,
    });

    res.status(status.CREATED).json({ data: submission });
  }

  @httpGet('/submissions/:submissionId', auth())
  async getSubmission(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;
    const submissionId = req.params.submissionId;

    let submission = await this.quizService.findSubmissionById(submissionId);
    if (!submission)
      throw new CustomException('Submission not found', status.NOT_FOUND);

    // validate user has access to submission
    if (userId !== submission.created_by)
      throw new CustomException('You do not have access to this submission', status.FORBIDDEN);

    submission = await submission.populate('quiz');
    res.status(status.OK).json({ data: submission });
  }

  @httpGet('/:id/submissions', auth())
  async getSubmissions(req: Request, res: Response): Promise<void> {

  }


}