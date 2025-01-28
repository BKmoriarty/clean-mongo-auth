import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class AddRoleToGroupUseCase {
  constructor(
    private groupRepository: GroupRepository,
    private roleRepository: RoleRepository,
  ) {}

  async execute(groupId: string, roleId: string): Promise<Boolean> {
    if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(roleId)) {
      throw new UUIDError();
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundError('Role Id');
    }

    const result = await this.groupRepository.addRoleToGroup(groupId, roleId);
    if (!result) {
      throw new NotFoundError('Group Id');
    }
    return result;
  }
}
