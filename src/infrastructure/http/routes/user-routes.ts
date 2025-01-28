import {Router} from 'express';
import {CreateUserUseCase} from '@/domain/usecases/user/create-user';
import {UserRepository} from '@/domain/repositories/user-repository.interface';
import {UserController} from '../controllers/user-controller';
import {FindByIdUserUseCase} from '@/domain/usecases/user/findById-user';
import {UpdateUserUseCase} from '@/domain/usecases/user/update-user';
import {DeleteUserUseCase} from '@/domain/usecases/user/delete-user';

export const userRouter = (userRepository: UserRepository): Router => {
  const router = Router();

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const findUserByIdUseCase = new FindByIdUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  const userController = new UserController(
    createUserUseCase,
    findUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  );

  router.post('/users', userController.createUser);
  return router;
};
