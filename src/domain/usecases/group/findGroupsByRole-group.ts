import {GroupResponse} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';

export class FindGroupsByRoleUseCase {
  constructor(private groupRepository: GroupRepository) {}
  async execute(roleId: string): Promise<GroupResponse[]> {
    return this.groupRepository.findGroupsByRole(roleId);
  }
}
