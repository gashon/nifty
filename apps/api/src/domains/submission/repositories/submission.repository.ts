import { inject, injectable } from 'inversify';

import type {
  DB,
  Insertable,
  KysleyDB,
  SelectExpression,
  Submission,
  FreeResponseAnswerSubmission,
  MultipleChoiceAnswerSubmission,
  Transaction,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';

@injectable()
export class SubmissionRepository {
  constructor(@inject(BINDING.DB) private db: KysleyDB) {}

  async linkFreeResponseAnswerToSubmission(
    {
      submissionId,
      answers,
    }: {
      submissionId: number;
      answers: FreeResponseAnswerSubmission[];
    },
    trx?: Transaction<DB>
  ) {
    if (answers.length === 0) return [];

    return (trx || this.db)
      .insertInto('submissionAnswerFreeResponse')
      .values(
        answers.map((answer) => ({
          submissionId,
          ...answer,
        }))
      )
      .returningAll()
      .execute();
  }

  async linkMultipleChoiceAnswerToSubmission(
    {
      submissionId,
      answers,
    }: {
      submissionId: number;
      answers: MultipleChoiceAnswerSubmission[];
    },
    trx?: Transaction<DB>
  ) {
    if (answers.length === 0) return [];

    return (trx || this.db)
      .insertInto('submissionAnswerMultipleChoice')
      .values(
        answers.map((answer) => ({
          submissionId,
          ...answer,
        }))
      )
      .returningAll()
      .execute();
  }

  async createSubmission({
    values,
    answers,
  }: {
    values: Insertable<Submission>;
    answers: {
      freeResponse: FreeResponseAnswerSubmission[];
      multipleChoice: MultipleChoiceAnswerSubmission[];
    };
  }) {
    return this.db.transaction().execute(async (trx) => {
      const submission = await trx
        .insertInto('submission')
        .values(values)
        .returningAll()
        .executeTakeFirstOrThrow();

      const [freeResponseAnswers, multiplChoiceAnswers] = await Promise.all([
        this.linkFreeResponseAnswerToSubmission(
          {
            submissionId: submission.id,
            answers: answers.freeResponse,
          },
          trx
        ),
        this.linkMultipleChoiceAnswerToSubmission(
          {
            submissionId: submission.id,
            answers: answers.multipleChoice,
          },
          trx
        ),
      ]);

      return {
        submission,
        answers: { freeResponseAnswers, multiplChoiceAnswers },
      };
    });
  }

  async getSubmissionById({
    id,
    select,
    joinAnswers,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'submission'>[] | '*';
    joinAnswers?: boolean;
  }) {
    const query = this.db
      .selectFrom('submission')
      .where('id', '=', id)
      .where('deletedAt', 'is', null);

    let submission: Submission;
    if (select !== '*')
      submission = await query.select(select).executeTakeFirst();
    else submission = await query.selectAll().executeTakeFirst();

    if (!joinAnswers) return submission;

    const [freeResponseSubmissionAnswers, multipleChoiceSubmissionAnswers] =
      await Promise.all([
        this.getFreeResponseSubmisisonAnswerBySubmissionId({
          submissionId: Number(submission.id),
        }),
        this.getMultipleChoiceSubmisisonAnswerBySubmissionId({
          submissionId: Number(submission.id),
        }),
      ]);

    return {
      ...submission,
      answers: {
        freeResponseAnswers: freeResponseSubmissionAnswers,
        multipleChoiceAnswers: multipleChoiceSubmissionAnswers,
      },
    };
  }

  async getFreeResponseSubmisisonAnswerBySubmissionId({
    submissionId,
  }: {
    submissionId: number;
  }) {
    return this.db
      .selectFrom('submissionAnswerFreeResponse')
      .where('submissionId', '=', submissionId)
      .where('deletedAt', 'is', null)
      .selectAll()
      .execute();
  }

  async getMultipleChoiceSubmisisonAnswerBySubmissionId({
    submissionId,
  }: {
    submissionId: number;
  }) {
    return this.db
      .selectFrom('submissionAnswerMultipleChoice')
      .where('submissionId', '=', submissionId)
      .where('deletedAt', 'is', null)
      .selectAll()
      .execute();
  }

  async deleteSubmissionById(id: number) {
    return this.db
      .updateTable('submission')
      .set({ deletedAt: new Date() })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async paginateSubmissionsByQuizId({
    quizId,
    cursor,
    limit,
  }: {
    quizId: number;
    cursor: Date | undefined;
    limit: number;
  }) {
    let query = this.db
      .selectFrom('submission')
      .where('quizId', '=', quizId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      query = query.where('createdAt', '<', cursor);
    }

    return query.execute();
  }
}
