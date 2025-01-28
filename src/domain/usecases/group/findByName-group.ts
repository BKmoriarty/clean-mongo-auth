import {GroupResponse} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {NotFoundError} from '@/infrastructure/http/utils/errors';

export class FindByNameGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(name: string): Promise<GroupResponse> {
    const group = await this.groupRepository.findByName(name);
    if (!group) {
      throw new NotFoundError('Group Name');
    }
    return group;
  }
}
