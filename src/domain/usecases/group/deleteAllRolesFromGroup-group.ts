import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class DeleteAllRolesFromGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(groupId: string): Promise<Boolean> {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new UUIDError();
    }
    const result = await this.groupRepository.deleteAllRolesFromGroup(groupId);
    if (!result) {
      throw new NotFoundError('Group Id');
    }
    return result;
  }
}
