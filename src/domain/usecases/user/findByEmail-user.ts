import {NotFoundError} from '@/infrastructure/http/utils/errors';
import {UserResponse} from '../../entities/user';
import {UserRepository} from '../../repositories/user-repository.interface';

export class FindByEmailUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(email: string): Promise<UserResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User Email');
    }
    return user;
  }
}
