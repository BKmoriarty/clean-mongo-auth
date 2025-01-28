import {GroupController} from '../controllers/group-controller';
import {validate} from '../middleware/validate';
import {Router} from 'express';
import {CreateGroupUseCase} from '@/domain/usecases/group/CRUD/create-group';
import {DeleteGroupUseCase} from '@/domain/usecases/group/CRUD/delete-group';
import {FindAllGroupUseCase} from '@/domain/usecases/group/CRUD/findAll-group';
import {FindByIdGroupUseCase} from '@/domain/usecases/group/CRUD/findById-group';
import {FindByNameGroupUseCase} from '@/domain/usecases/group/CRUD/findByName-group';
import {UpdateGroupUseCase} from '@/domain/usecases/group/CRUD/update-group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {createGroupSchema, updateGroupSchema} from '../validators/group.validator';

export const groupRouter = (repository: GroupRepository, roleRepository: RoleRepository) => {
  const router = Router();

  const createGroupUseCase = new CreateGroupUseCase(repository, roleRepository);
  const findAllUseCase = new FindAllGroupUseCase(repository);
  const findByIdUseCase = new FindByIdGroupUseCase(repository);
  const findByNameUseCase = new FindByNameGroupUseCase(repository);
  const updateGroupUseCase = new UpdateGroupUseCase(repository);
  const deleteGroupUseCase = new DeleteGroupUseCase(repository);

  const groupController = new GroupController(
    createGroupUseCase,
    findAllUseCase,
    findByIdUseCase,
    findByNameUseCase,
    updateGroupUseCase,
    deleteGroupUseCase,
  );

  router.post('/groups', validate(createGroupSchema), groupController.createGroup);
  router.get('/groups', groupController.findAll);
  router.put('/groups/:id', validate(updateGroupSchema), groupController.updateGroup);
  router.delete('/groups/:id', groupController.deleteGroup);

  return router;
};
