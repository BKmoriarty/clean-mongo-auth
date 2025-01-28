import {CreateRoleUseCase} from '@/domain/usecases/role/create-role';
import {catchAsync} from '../utils/catchAsync';
import type {Request, Response} from 'express';
import {DeleteRoleUseCase} from '@/domain/usecases/role/delete-role';
import {FindByIdRoleUseCase} from '@/domain/usecases/role/findById-role';
import {FindByNameRoleUseCase} from '@/domain/usecases/role/findByName-role';
import {UpdateRoleUseCase} from '@/domain/usecases/role/update-role';
import {FindAllRoleUseCase} from '@/domain/usecases/role/findAll-role';
import {RoleResponse} from '@/domain/entities/role';

export class RoleController {
  constructor(
    private createRoleUseCase: CreateRoleUseCase,
    private findAllUseCase: FindAllRoleUseCase,
    private findByIdUseCase: FindByIdRoleUseCase,
    private findByNameUseCase: FindByNameRoleUseCase,
    private updateRoleUseCase: UpdateRoleUseCase,
    private deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  createRole = catchAsync(async (req: Request, res: Response) => {
    const {name, description} = req.body;
    const role = await this.createRoleUseCase.execute({
      name,
      description,
    });
    res.status(201).json(this.mapToResponse('Role created successfully', role));
  });

  findAll = catchAsync(async (req: Request, res: Response) => {
    const {name, id} = req.query;
    let roles: RoleResponse | RoleResponse[];
    if (id) roles = await this.findByIdUseCase.execute(id as string);
    else if (name) roles = await this.findByNameUseCase.execute(name as string);
    else roles = await this.findAllUseCase.execute();
    res.status(200).json(this.mapToResponse('Role found successfully', roles));
  });

  updateRole = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const role = await this.updateRoleUseCase.execute(id, req.body);
    res.status(200).json(this.mapToResponse('Role updated successfully', role));
  });

  deleteRole = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    await this.deleteRoleUseCase.execute(id);
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
