import {GroupResponse} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class FindByIdGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(id: string): Promise<GroupResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UUIDError();
    }

    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundError('Group Id');
    }
    return group;
  }
}
