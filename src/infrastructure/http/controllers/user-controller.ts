import {Request, Response} from 'express';
import {CreateUserUseCase} from '../../../domain/usecases/user/create-user';
import {catchAsync} from '../utils/catchAsync';
import {FindByIdUserUseCase} from '@/domain/usecases/user/findById-user';
import {UpdateUserUseCase} from '@/domain/usecases/user/update-user';
import {DeleteUserUseCase} from '@/domain/usecases/user/delete-user';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private findUserByIdUseCase: FindByIdUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  createUser = catchAsync(async (req: Request, res: Response) => {
    const {email, name, password, groupRoles} = req.body;
    const user = await this.createUserUseCase.execute({
      email,
      name,
      password,
      groupRoles,
    });
    res.status(201).json(this.mapToResponse('User created successfully', user));
  });

  getUserById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = await this.findUserByIdUseCase.execute(id);
    res.status(200).json(this.mapToResponse('User found successfully', user));
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = await this.updateUserUseCase.execute(id, req.body);
    res.status(200).json(this.mapToResponse('User updated successfully', user));
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    await this.deleteUserUseCase.execute(id);
    res.status(204).send();
  });

  private mapToResponse(message: string, data: any) {
    return {
      status: 'success',
      message,
      data,
    };
  }
}
