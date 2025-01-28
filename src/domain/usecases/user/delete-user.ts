import {NotFoundError} from '@/infrastructure/http/utils/errors';
import {UserRepository} from '../../repositories/user-repository.interface';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User Id');
    }
    return this.userRepository.delete(id);
  }
}
