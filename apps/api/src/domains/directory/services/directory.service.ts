import { injectable, inject } from 'inversify';

import type {
  Insertable,
  SelectExpression,
  Directory,
  DB,
} from '@nifty/common/types';
import { BINDING } from '@nifty/api/domains/binding';
import { DirectoryRepository } from '@nifty/api/domains';

@injectable()
export class DirectoryService {
  constructor(
    @inject(BINDING.DIRECTORY_REPOSITORY)
    private directoryRepository: DirectoryRepository
  ) {}

  async createDirectory({
    values,
    returning,
  }: {
    values: Insertable<Directory>;
    returning: readonly SelectExpression<DB, 'directory'>[] | '*';
  }) {
    return this.directoryRepository.createDirectory({ values, returning });
  }
}
