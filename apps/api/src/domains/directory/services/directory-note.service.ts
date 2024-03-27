import { injectable, inject } from 'inversify';

import type { SelectExpression, DB } from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { DirectoryNoteRepository } from '@nifty/api/domains';

@injectable()
export class DirectoryNoteService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private directoryNoteRepository: DirectoryNoteRepository
  ) {}

  async paginateNotesByDirectoryId({
    directoryId,
    select,
    limit,
    cursor,
  }: {
    directoryId: number;
    select: readonly SelectExpression<DB, 'note'>[];
    limit: number;
    cursor?: Date;
  }) {
    return this.directoryNoteRepository.paginateNotesByDirectoryId({
      directoryId,

      cursor,
      limit,
    });
  }
}
