import {NotFoundError, ValidationError} from '@/infrastructure/http/utils/errors';
import {GroupRepository} from '../../repositories/group-repository.interface';
import {RoleRepository} from '../../repositories/role-repository.interface';
import {UserRepository} from '../../repositories/user-repository.interface';
import {UserResponse} from '../../entities/user';

export class AddGroupRoleToUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private groupRepository: GroupRepository,
    private roleRepository: RoleRepository,
  ) {}

  async execute(userId: string, groupId: string, roleId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User Id');
    }

    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundError('Group Id');
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundError('Role Id');
    }

    // Check if the role exists in the group
    const roleExistsInGroup = group.roles.some(r => r.roleId === roleId);
    if (!roleExistsInGroup) {
      throw new ValidationError('Role does not exist in the specified group');
    }

    const userWithGroupRole = await this.userRepository.addGroupRoleToUser(userId, groupId, roleId);
    if (!userWithGroupRole) {
      throw new ValidationError('Failed to add group role to user');
    }
    return userWithGroupRole;
  }
}
