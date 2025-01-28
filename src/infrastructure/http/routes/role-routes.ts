import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {CreateRoleUseCase} from '@/domain/usecases/role/create-role';
import {DeleteRoleUseCase} from '@/domain/usecases/role/delete-role';
import {FindByIdRoleUseCase} from '@/domain/usecases/role/findById-role';
import {FindByNameRoleUseCase} from '@/domain/usecases/role/findByName-role';
import {UpdateRoleUseCase} from '@/domain/usecases/role/update-role';
import {Router} from 'express';
import {RoleController} from '../controllers/role-controller';
import {FindAllRoleUseCase} from '@/domain/usecases/role/findAll-role';
import {validate} from '../middleware/validate';
import {createRoleSchema, updateRoleSchema} from '../validators/role.validator';

export const roleRouter = (repository: RoleRepository) => {
  const router = Router();

  const createRoleUseCase = new CreateRoleUseCase(repository);
  const findAllUseCase = new FindAllRoleUseCase(repository);
  const findByIdUseCase = new FindByIdRoleUseCase(repository);
  const findByNameUseCase = new FindByNameRoleUseCase(repository);
  const updateRoleUseCase = new UpdateRoleUseCase(repository);
  const deleteRoleUseCase = new DeleteRoleUseCase(repository);

  const roleController = new RoleController(
    createRoleUseCase,
    findAllUseCase,
    findByIdUseCase,
    findByNameUseCase,
    updateRoleUseCase,
    deleteRoleUseCase,
  );

  router.post('/roles', validate(createRoleSchema), roleController.createRole);
  router.get('/roles', roleController.findAll);
  router.put('/roles/:id', validate(updateRoleSchema), roleController.updateRole);
  router.delete('/roles/:id', roleController.deleteRole);

  return router;
};
