import {Request, Response} from 'express';
import {CreateGroupUseCase} from '@/domain/usecases/group/CRUD/create-group';
import {DeleteGroupUseCase} from '@/domain/usecases/group/CRUD/delete-group';
import {FindAllGroupUseCase} from '@/domain/usecases/group/CRUD/findAll-group';
import {FindByIdGroupUseCase} from '@/domain/usecases/group/CRUD/findById-group';
import {FindByNameGroupUseCase} from '@/domain/usecases/group/CRUD/findByName-group';
import {UpdateGroupUseCase} from '@/domain/usecases/group/CRUD/update-group';
import {catchAsync} from '../utils/catchAsync';

export class GroupController {
  constructor(
    private createGroupUseCase: CreateGroupUseCase,
    private findAllUseCase: FindAllGroupUseCase,
    private findByIdUseCase: FindByIdGroupUseCase,
    private findByNameUseCase: FindByNameGroupUseCase,
    private updateGroupUseCase: UpdateGroupUseCase,
    private deleteGroupUseCase: DeleteGroupUseCase,
  ) {}

  createGroup = catchAsync(async (req: Request, res: Response) => {
    const {name, description} = req.body;
    const group = await this.createGroupUseCase.execute({
      name,
      description,
    });
    res.status(201).json(this.mapToResponse('Group created successfully', group));
  });

  findAll = catchAsync(async (req: Request, res: Response) => {
    const {name, id} = req.query;
    let groups: any;
    if (id) groups = await this.findByIdUseCase.execute(id as string);
    else if (name) groups = await this.findByNameUseCase.execute(name as string);
    else groups = await this.findAllUseCase.execute();
    res.status(200).json(this.mapToResponse('Group found successfully', groups));
  });

  updateGroup = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const group = await this.updateGroupUseCase.execute(id, req.body);
    res.status(200).json(this.mapToResponse('Group updated successfully', group));
  });

  deleteGroup = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    await this.deleteGroupUseCase.execute(id);
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
