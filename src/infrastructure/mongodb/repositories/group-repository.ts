import {
  EmbeddedRole,
  Group,
  GroupCreate,
  GroupResponse,
  GroupUpdate,
} from '@/domain/entities/group';
import {GroupRepository} from '@/domain/repositories/group-repository.interface';
import {GroupModel} from '../models/group-model';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';

export class MongoDBGroupRepository implements GroupRepository {
  constructor(private roleRepository: RoleRepository) {}

  async create(groupData: GroupCreate): Promise<Group> {
    const group = await GroupModel.create(groupData);
    return this.mapToGroupCreate(group);
  }

  async findAll(): Promise<GroupResponse[]> {
    const groups = await GroupModel.find().populate('roles');
    return groups.map(group => this.mapToGroup(group));
  }

  async findById(id: string): Promise<GroupResponse | null> {
    const group = await GroupModel.findById(id).populate('roles');
    return group ? this.mapToGroup(group) : null;
  }

  async findByName(name: string): Promise<GroupResponse | null> {
    const group = await GroupModel.findOne({name}).populate('roles');
    return group ? this.mapToGroup(group) : null;
  }

  async findGroupsByRole(roleId: string): Promise<GroupResponse[]> {
    const groups = await GroupModel.find({roles: roleId}).populate('roles');
    return groups.map(group => this.mapToGroup(group));
  }

  async update(id: string, group: GroupUpdate): Promise<GroupResponse | null> {
    const updatedGroup = await GroupModel.findByIdAndUpdate(id, group, {
      new: true,
    });
    return updatedGroup ? this.mapToGroup(updatedGroup) : null;
  }

  async delete(id: string): Promise<Boolean> {
    const result = await GroupModel.findByIdAndDelete(id);
    return !!result;
  }

  async addRoleToGroup(groupId: string, roleId: string): Promise<Boolean> {
    const result = await GroupModel.findByIdAndUpdate(groupId, {
      $push: {roles: roleId},
    });
    return !!result;
  }

  async removeRoleFromGroup(groupId: string, roleId: string): Promise<Boolean> {
    const result = await GroupModel.findByIdAndUpdate(groupId, {
      $pull: {roles: roleId},
    });
    return !!result;
  }

  async deleteAllRolesFromGroup(groupId: string): Promise<Boolean> {
    const result = await GroupModel.findByIdAndUpdate(groupId, {
      $set: {roles: []},
    });
    return !!result;
  }

  private mapToGroup(doc: any): GroupResponse {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      roles: doc.roles.map((role: EmbeddedRole) => ({
        roleId: role._id.toString(),
        name: role.name,
        description: role.description,
      })),
    };
  }

  private mapToGroupCreate(doc: any): Group {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      roles: doc.roles.map((role: string) => role.toString()),
    };
  }
}
