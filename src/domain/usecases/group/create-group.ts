import {Group, GroupCreate} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {
  ConflictError,
  NotFoundError,
  UUIDError,
} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class CreateGroupUseCase {
  constructor(
    private groupRepository: GroupRepository,
    private roleRepository: RoleRepository,
  ) {}

  async execute(group: GroupCreate): Promise<Group> {
    const groupExists = await this.groupRepository.findByName(group.name);

    if (groupExists) {
      throw new ConflictError('Group Name');
    }

    if (group.roles.length > 0) {
      await Promise.all(
        group.roles.map(async roleId => {
          if (!Types.ObjectId.isValid(roleId)) {
            throw new UUIDError();
          }
          const role = await this.roleRepository.findById(roleId);
          if (!role) {
            throw new NotFoundError('Role Id');
          }
          return role;
        }),
      );
    }

    return this.groupRepository.create(group);
  }
}
