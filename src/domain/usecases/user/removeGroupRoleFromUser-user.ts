import {UserRepository} from '../../repositories/user-repository.interface';
import {NotFoundError} from '@/infrastructure/http/utils/errors';

export class RemoveGroupRoleFromUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, groupId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User Id');
    }

    return this.userRepository.removeGroupRoleFromUser(userId, groupId);
  }
}
