import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class DeleteGroupUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(id: string): Promise<Boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UUIDError();
    }

    const result = await this.groupRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Group Id');
    }
    return result;
  }
}
