import {GroupResponse} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class FindChildrenUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(parentId: string): Promise<GroupResponse[]> {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new UUIDError();
    }

    const group = await this.groupRepository.findById(parentId);
    if (!group) {
      throw new NotFoundError('Parent Group Id');
    }

    return this.groupRepository.findChildren(parentId);
  }
}
