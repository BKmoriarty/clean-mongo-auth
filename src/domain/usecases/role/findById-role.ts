import {RoleResponse} from '@/domain/entities/role';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class FindByIdRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: string): Promise<RoleResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UUIDError();
    }

    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError('Role Id');
    }
    return role;
  }
}
