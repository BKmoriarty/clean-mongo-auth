import {Group, GroupCreate, GroupResponse, GroupUpdate} from '../entities/group';

export interface GroupRepository {
  findAll(): Promise<GroupResponse[]>;
  create(group: GroupCreate): Promise<Group>;
  findById(id: string): Promise<GroupResponse | null>;
  findByName(name: string): Promise<GroupResponse | null>;
  findGroupsByRole(roleId: string): Promise<GroupResponse[]>;
  update(id: string, group: GroupUpdate): Promise<GroupResponse | null>;
  delete(id: string): Promise<Boolean>;
  deleteAllRolesFromGroup(groupId: string): Promise<Boolean>;
  addRoleToGroup(groupId: string, roleId: string): Promise<Boolean>;
  removeRoleFromGroup(groupId: string, roleId: string): Promise<Boolean>;
}
