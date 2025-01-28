import {NotFoundError} from '@/infrastructure/http/utils/errors';
import {User, UserResponse} from '../../entities/user';
import {UserRepository} from '../../repositories/user-repository.interface';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: string, userData: Partial<User>): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User Id');
    }
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundError('User Id');
    }
    return updatedUser;
  }
}
