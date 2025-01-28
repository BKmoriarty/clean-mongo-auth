import {RoleResponse} from '@/domain/entities/role';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';

export class FindAllRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}
  execute(): Promise<RoleResponse[]> {
    return this.roleRepository.findAll();
  }
}
