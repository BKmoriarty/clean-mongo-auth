import {GroupUpdate, GroupResponse} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {
  ConflictError,
  NotFoundError,
  UUIDError,
} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class UpdateGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(id: string, group: GroupUpdate): Promise<GroupResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UUIDError();
    }

    if (group.name) {
      const groupExists = await this.groupRepository.findByName(group.name);
      if (groupExists && groupExists.id !== id) {
        throw new ConflictError('Group Name');
      }
    }

    const groupUpdated = await this.groupRepository.update(id, group);
    if (!groupUpdated) {
      throw new NotFoundError('Group Id');
    }
    return groupUpdated;
  }
}
