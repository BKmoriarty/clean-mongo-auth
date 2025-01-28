import {GroupResponse} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';

export class FindAllGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(): Promise<GroupResponse[]> {
    return this.groupRepository.findAll();
  }
}
