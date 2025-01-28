import {RoleResponse} from '@/domain/entities/role';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {NotFoundError} from '@/infrastructure/http/utils/errors';

export class FindByNameRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}
  async execute(name: string): Promise<RoleResponse> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundError('Role Name');
    }
    return role;
  }
}
