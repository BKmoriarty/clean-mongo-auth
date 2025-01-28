import {ConflictError} from '@/infrastructure/http/utils/errors';
import {UserCreate, UserResponse} from '../../entities/user';
import {UserRepository} from '../../repositories/user-repository.interface';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Omit<UserCreate, 'id'>): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    return this.userRepository.create(userData);
  }
}
