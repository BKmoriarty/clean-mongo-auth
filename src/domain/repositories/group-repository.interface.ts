import {Group, GroupCreate, GroupResponse, GroupUpdate} from '../entities/group';

export interface GroupRepository {
  findAll(): Promise<GroupResponse[]>;
  create(group: GroupCreate): Promise<Group>;
  findById(id: string): Promise<GroupResponse | null>;
  findByName(name: string): Promise<GroupResponse | null>;
  update(id: string, group: GroupUpdate): Promise<GroupResponse | null>;
  delete(id: string): Promise<Boolean>;

  findGroupsByRole(roleId: string): Promise<GroupResponse[]>;
  deleteAllRolesFromGroup(groupId: string): Promise<Boolean>;
  addRoleToGroup(groupId: string, roleId: string): Promise<Boolean>;
  removeRoleFromGroup(groupId: string, roleId: string): Promise<Boolean>;

  findChildren(parentId: string): Promise<GroupResponse[]>; // Get all sub-groups
  findParent(groupId: string): Promise<GroupResponse | null>; // Get parent group
  getHierarchy(parentId?: string | null): Promise<GroupResponse[]>; // Get full tree structure
}
