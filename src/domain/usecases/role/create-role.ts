import {RoleCreate, RoleResponse} from '@/domain/entities/role';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {ConflictError} from '@/infrastructure/http/utils/errors';

export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}
  async execute(role: RoleCreate): Promise<RoleResponse> {
    const existingRole = await this.roleRepository.findByName(role.name);
    if (existingRole) {
      throw new ConflictError('Role Name');
    }
    return this.roleRepository.create(role);
  }
}
