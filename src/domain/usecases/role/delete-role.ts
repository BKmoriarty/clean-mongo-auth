import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {Types} from 'mongoose';

export class DeleteRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new UUIDError();
    }

    const result = await this.roleRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Role Id');
    }
    return result;
  }
}
