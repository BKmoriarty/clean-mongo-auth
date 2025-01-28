import {RoleResponse, RoleUpdate} from '@/domain/entities/role';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {
  ConflictError,
  NotFoundError,
  UUIDError,
} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class UpdateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: string, role: RoleUpdate): Promise<RoleResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UUIDError();
    }

    if (role.name) {
      const existingRole = await this.roleRepository.findByName(role.name);
      if (existingRole && existingRole.id !== id) {
        throw new ConflictError('Role Name');
      }
    }

    const updatedRole = await this.roleRepository.update(id, role);
    if (!updatedRole) {
      throw new NotFoundError('Role Id');
    }

    return updatedRole;
  }
}
