import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class AddRoleToGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(groupId: string, roleId: string): Promise<Boolean> {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new UUIDError();
    }

    const result = await this.groupRepository.addRoleToGroup(groupId, roleId);
    if (!result) {
      throw new NotFoundError('Group Id');
    }
    return result;
  }
}
