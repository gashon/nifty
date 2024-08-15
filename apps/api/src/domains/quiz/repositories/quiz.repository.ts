import { inject, injectable } from 'inversify';

import type {
  KysleyDB,
  Insertable,
  SelectExpression,
  DB,
  Quiz,
  Updateable,
  Transaction,
  FreeResponseQuestion,
  MultipleChoiceQuestion,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { Permission } from '@nifty/api/util';

@injectable()
export class QuizRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async createQuiz({
    values,
    returning,
  }: {
    values: Insertable<Quiz>;
    returning: readonly SelectExpression<DB, 'quiz'>[] | '*';
  }) {
    const query = this.db.insertInto('quiz').values(values);

    if (returning !== '*')
      return query.returning(returning).executeTakeFirstOrThrow();

    return query.returningAll().executeTakeFirstOrThrow();
  }

  async linkFreeResponseQuestions(
    {
      quizId,
      questions,
    }: {
      quizId: number;
      questions: FreeResponseQuestion[];
    },
    trx?: Transaction<DB>
  ) {
    if (questions.length === 0) return [];

    return (trx || this.db)
      .insertInto('quizQuestionFreeResponse')
      .values(
        questions.map(({ question }) => ({
          quizId,
          question,
        }))
      )
      .returningAll()
      .execute();
  }

  async linkMultipleChoiceQuestions(
    {
      quizId,
      questions,
    }: {
      quizId: number;
      questions: MultipleChoiceQuestion[];
    },
    trx?: Transaction<DB>
  ) {
    if (questions.length === 0) return [];

    return (trx || this.db)
      .insertInto('quizQuestionMultipleChoice')
      .values(
        questions.map(({ question, answers, correctIndex }) => ({
          quizId,
          question,
          answers,
          correctIndex,
        }))
      )
      .returningAll()
      .execute();
  }

  async createQuizAndCollaborator({
    userId,
    values,
    questions,
    collabortorPermissions,
  }: {
    userId: number;
    noteId: number;
    values: Insertable<Quiz>;
    questions: {
      freeResponse: FreeResponseQuestion[];
      multipleChoice: MultipleChoiceQuestion[];
    };
    collabortorPermissions: Permission;
  }) {
    return this.db.transaction().execute(async (trx) => {
      // create quiz and collaborators together
      const [quiz, collaborator] = await Promise.all([
        await trx
          .insertInto('quiz')
          .values(values)
          .returningAll()
          .executeTakeFirstOrThrow(),
        trx
          .insertInto('collaborator')
          .values({
            userId,
            createdBy: userId,
            permissions: collabortorPermissions,
          })
          .returningAll()
          .executeTakeFirstOrThrow(),
      ]);

      console.log('quiz vals', values);
      console.log('created quiz here', quiz, collaborator);

      // link questions and collaborator
      const [quizCollaborator, freeResponseQuestions, multipleChoiceQuestions] =
        await Promise.all([
          trx
            .insertInto('quizCollaborator')
            .values({
              userId,
              quizId: quiz.id,
              collaboratorId: collaborator.id,
            })
            .returningAll()
            .execute(),
          this.linkFreeResponseQuestions(
            {
              questions: questions.freeResponse,
              quizId: quiz.id,
            },
            trx
          ),
          this.linkMultipleChoiceQuestions(
            {
              questions: questions.multipleChoice,
              quizId: quiz.id,
            },
            trx
          ),
        ]);

      return {
        quiz,
        collaborator,
        quizCollaborator,
        freeResponseQuestions,
        multipleChoiceQuestions,
      };
    });
  }

  async getQuizById({
    id,
    select,
    joinQuestions,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'quiz'>[] | '*';
    joinQuestions?: boolean;
  }) {
    const query = this.db
      .selectFrom('quiz')
      .where('quiz.id', '=', id)
      .where('quiz.deletedAt', 'is', null);

    let quiz;
    if (select !== '*')
      quiz = await query.select(select).executeTakeFirstOrThrow();
    else quiz = await query.selectAll().executeTakeFirst();

    if (!joinQuestions) return quiz;

    const tasks = [];
    if (quiz?.multipleChoiceActivated) {
      tasks.push(this.getMultipleChoiceQuestionsByQuizId(id));
    }
    if (quiz?.freeResponseActivated) {
      tasks.push(this.getFreeResponseQuestionsByQuizId(id));
    }

    const [multipleChoiceQuestions, freeResponseQuestions] = await Promise.all(
      tasks
    );

    return {
      ...quiz,
      // hide correctIndex
      multipleChoiceQuestions: multipleChoiceQuestions.map(
        ({ correctIndex, ...rest }) => ({ ...rest })
      ),
      freeResponseQuestions,
    };
  }

  async getMultipleChoiceQuestionsByQuizId(quizId: number) {
    return this.db
      .selectFrom('quizQuestionMultipleChoice')
      .where('quizId', '=', quizId)
      .where('deletedAt', 'is', null)
      .selectAll()
      .execute();
  }

  async getFreeResponseQuestionsByQuizId(quizId: number) {
    return this.db
      .selectFrom('quizQuestionFreeResponse')
      .where('quizId', '=', quizId)
      .where('deletedAt', 'is', null)
      .selectAll()
      .execute();
  }

  async updateQuizById({
    id,
    values,
  }: {
    id: number;
    values: Updateable<Quiz>;
  }) {
    return this.db
      .updateTable('quiz')
      .set(values)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirstOrThrow();
  }

  async deleteQuizById(id: number) {
    return this.db
      .updateTable('quiz')
      .set({ deletedAt: new Date() })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirstOrThrow();
  }
}
