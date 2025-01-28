import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError} from '@/infrastructure/http/utils/errors';

export class DeleteAllRolesFromGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(groupId: string): Promise<Boolean> {
    const result = await this.groupRepository.deleteAllRolesFromGroup(groupId);
    if (!result) {
      throw new NotFoundError('Group Id');
    }
    return result;
  }
}
