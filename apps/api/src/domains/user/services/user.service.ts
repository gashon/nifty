import { inject, injectable } from 'inversify';

import { BINDING } from '@nifty/api/domains/binding';
import { UserRepository } from '@nifty/api/domains';

@injectable()
export class UserService {
  constructor(
    @inject(BINDING.USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  async getUserById({
    id,
    select,
  }: {
    id: number;
    select: readonly SelectExpression<DB, 'user'>[] | '*';
  }) {
    return this.userRepository.getUserById({ id, select });
  }
}
