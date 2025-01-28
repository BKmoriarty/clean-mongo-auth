import {NotFoundError} from '@/infrastructure/http/utils/errors';
import {UserResponse} from '../../entities/user';
import {UserRepository} from '../../repositories/user-repository.interface';

export class FindByIdUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User Id');
    }
    return user;
  }
}
