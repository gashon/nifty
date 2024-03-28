import { injectable, inject } from 'inversify';

import type {
  SelectExpression,
  DB,
  Submission,
  FreeResponseAnswerSubmission,
  MultipleChoiceAnswerSubmission,
  Insertable,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { SubmissionRepository } from '@nifty/api/domains';

@injectable()
export class SubmissionService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private submissionRepository: SubmissionRepository
  ) {}

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
    return this.submissionRepository.createSubmission({
      values,
      answers,
    });
  }

  async getSubmissionById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'submission'>[] | '*';
  }) {
    return this.submissionRepository.getSubmissionById({
      id,
      select,
    });
  }
  async deleteSubmissionById(id: number) {
    return this.submissionRepository.deleteSubmissionById(id);
  }

  async paginateSubmissionsByQuizId({
    quizId,
    limit,
    cursor,
  }: {
    quizId: number;
    limit: number;
    cursor?: Date;
  }) {
    return this.submissionRepository.paginateSubmissionsByQuizId({
      quizId,
      limit,
      cursor,
    });
  }
}
