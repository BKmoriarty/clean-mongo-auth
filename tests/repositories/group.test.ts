import {AddRoleToGroupUseCase} from '@/domain/usecases/group/addRoleToGroup-group';
import {CreateGroupUseCase} from '@/domain/usecases/group/create-group';
import {DeleteGroupUseCase} from '@/domain/usecases/group/delete-group';
import {DeleteAllRolesFromGroupUseCase} from '@/domain/usecases/group/deleteAllRolesFromGroup-group';
import {FindByIdGroupUseCase} from '@/domain/usecases/group/findById-group';
import {FindByNameGroupUseCase} from '@/domain/usecases/group/findByName-group';
import {FindGroupsByRoleUseCase} from '@/domain/usecases/group/findGroupsByRole-group';
import {UpdateGroupUseCase} from '@/domain/usecases/group/update-group';
import {CreateRoleUseCase} from '@/domain/usecases/role/create-role';
import {NotFoundError, UUIDError} from '@/infrastructure/http/utils/errors';
import {MongoDBGroupRepository} from '@/infrastructure/mongodb/repositories/group-repository';
import {MongoDBRoleRepository} from '@/infrastructure/mongodb/repositories/role-repository';
import {Types} from 'mongoose';

describe('GroupRepository', () => {
  let groupRepository: MongoDBGroupRepository;
  let roleRepository: MongoDBRoleRepository;

  let createGroupUseCase: CreateGroupUseCase;
  let findByIdUseCase: FindByIdGroupUseCase;
  let findByNameUseCase: FindByNameGroupUseCase;
  let findGroupsByRoleUseCase: FindGroupsByRoleUseCase;
  let updateGroupUseCase: UpdateGroupUseCase;
  let deleteGroupUseCase: DeleteGroupUseCase;
  let deleteAllRolesFromGroupUseCase: DeleteAllRolesFromGroupUseCase;
  let addRoleToGroupUseCase: AddRoleToGroupUseCase;

  let createRoleUseCase: CreateRoleUseCase;

  beforeEach(() => {
    roleRepository = new MongoDBRoleRepository();
    groupRepository = new MongoDBGroupRepository(roleRepository);

    createGroupUseCase = new CreateGroupUseCase(groupRepository, roleRepository);
    findByIdUseCase = new FindByIdGroupUseCase(groupRepository);
    findByNameUseCase = new FindByNameGroupUseCase(groupRepository);
    findGroupsByRoleUseCase = new FindGroupsByRoleUseCase(groupRepository);
    updateGroupUseCase = new UpdateGroupUseCase(groupRepository);
    deleteGroupUseCase = new DeleteGroupUseCase(groupRepository);
    deleteAllRolesFromGroupUseCase = new DeleteAllRolesFromGroupUseCase(groupRepository);
    addRoleToGroupUseCase = new AddRoleToGroupUseCase(groupRepository);

    createRoleUseCase = new CreateRoleUseCase(roleRepository);
  });

  const validGroup = {
    name: 'Group 1',
    description: 'Group description',
    roles: [],
  };

  describe('create', () => {
    it('should create a new group without roles', async () => {
      const group = await createGroupUseCase.execute(validGroup);

      expect(group).toHaveProperty('id');
      expect(group.name).toBe(validGroup.name);
      expect(group.description).toBe(validGroup.description);
      expect(group.roles).toEqual([]);
    });

    it('should create a new group with 1 roles', async () => {
      const role = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role description',
      });

      const group = await createGroupUseCase.execute({
        ...validGroup,
        roles: [role.id!],
      });

      expect(group).toHaveProperty('id');
      expect(group.name).toBe(validGroup.name);
      expect(group.description).toBe(validGroup.description);

      expect(group.roles.length).toBe(1);
      expect(group.roles[0]).toBe(role.id);
    });

    it('should create a new group with 2 roles', async () => {
      const role1 = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role description',
      });
      const role2 = await createRoleUseCase.execute({
        name: 'Role 2',
        description: 'Role description',
      });

      const group = await createGroupUseCase.execute({
        ...validGroup,
        roles: [role1.id!, role2.id!],
      });

      expect(group).toHaveProperty('id');
      expect(group.name).toBe(validGroup.name);
      expect(group.description).toBe(validGroup.description);

      expect(group.roles.length).toBe(2);
      expect(group.roles[0]).toBe(role1.id);
      expect(group.roles[1]).toBe(role2.id);
    });

    it('should throw ConflictError if group name already exists', async () => {
      await createGroupUseCase.execute(validGroup);
      await expect(createGroupUseCase.execute(validGroup)).rejects.toThrow(new Error('Group Name already exists'));
    });

    it('should throw Error if role not found', async () => {
      const _id = new Types.ObjectId();
      await expect(
        createGroupUseCase.execute({
          ...validGroup,
          roles: [_id.toString()],
        }),
      ).rejects.toThrow(new Error('Role Id not found'));
    });

    it('should throw UUIDError if role id is invalid', async () => {
      await expect(
        createGroupUseCase.execute({
          ...validGroup,
          roles: ['invalid-role-id'],
        }),
      ).rejects.toThrow(new UUIDError());
    });
  });

  describe('findAll', () => {
    it('should return empty array', async () => {
      const groups = await groupRepository.findAll();
      expect(groups).toEqual([]);
    });

    it('should return all groups', async () => {
      await createGroupUseCase.execute(validGroup);
      const groups = await groupRepository.findAll();
      expect(groups.length).toBe(1);
    });

    it('should return all groups with roles', async () => {
      const role = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role description',
      });
      await createGroupUseCase.execute({
        ...validGroup,
        roles: [role.id!],
      });
      const groups = await groupRepository.findAll();
      expect(groups.length).toBe(1);
      expect(groups[0].roles.length).toBe(1);
      expect(groups[0].roles[0].roleId).toBe(role.id);
      expect(groups[0].roles[0].name).toBe(role.name);
      expect(groups[0].roles[0].description).toBe(role.description);
    });
  });

  describe('findById', () => {
    it('should find a group by id without roles', async () => {
      const group = await createGroupUseCase.execute(validGroup);
      const foundGroup = await findByIdUseCase.execute(group.id!);

      expect(foundGroup).toHaveProperty('id');
      expect(foundGroup.name).toBe(validGroup.name);
      expect(foundGroup.description).toBe(validGroup.description);
      expect(foundGroup.roles).toEqual([]);
    });

    it('should find a group by id with 1 role', async () => {
      const role = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role description',
      });
      const group = await createGroupUseCase.execute({
        ...validGroup,
        roles: [role.id!],
      });
      const foundGroup = await findByIdUseCase.execute(group.id!);

      expect(foundGroup).toHaveProperty('id');
      expect(foundGroup.name).toBe(validGroup.name);
      expect(foundGroup.description).toBe(validGroup.description);

      expect(foundGroup.roles.length).toBe(1);
      expect(foundGroup.roles[0].roleId).toBe(role.id);
      expect(foundGroup.roles[0].name).toBe(role.name);
      expect(foundGroup.roles[0].description).toBe(role.description);
    });

    it('should throw NotFoundError if group not found', async () => {
      const _id = new Types.ObjectId();
      await expect(findByIdUseCase.execute(_id.toString())).rejects.toThrow(new NotFoundError('Group Id'));
    });

    it('should throw UUIDError if group id is invalid', async () => {
      await expect(findByIdUseCase.execute('invalidId')).rejects.toThrow(new UUIDError());
    });
  });

  describe('findByName', () => {
    it('should find a group by name without roles', async () => {
      const group = await createGroupUseCase.execute(validGroup);
      const foundGroup = await findByNameUseCase.execute(validGroup.name!);

      expect(foundGroup).toHaveProperty('id');
      expect(foundGroup.name).toBe(group.name);
      expect(foundGroup.description).toBe(group.description);
      expect(foundGroup.roles).toEqual([]);
    });

    it('should throw NotFoundError if group not found', async () => {
      await expect(findByNameUseCase.execute('nonexistentName')).rejects.toThrow(new NotFoundError('Group Name'));
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const group = await createGroupUseCase.execute(validGroup);
      const updatedGroup = await updateGroupUseCase.execute(group.id!, {
        name: 'Updated Group',
      });
      expect(updatedGroup).toHaveProperty('id');
      expect(updatedGroup.name).toBe('Updated Group');
      expect(updatedGroup.description).toBe(validGroup.description);
      expect(updatedGroup.roles).toEqual([]);
    });

    it('should throw NotFoundError if group not found', async () => {
      const _id = new Types.ObjectId();
      await expect(updateGroupUseCase.execute(_id.toString(), {})).rejects.toThrow(new NotFoundError('Group Id'));
    });

    it('should throw UUIDError if group id is invalid', async () => {
      await expect(updateGroupUseCase.execute('invalidId', {})).rejects.toThrow(new UUIDError());
    });
  });

  describe('delete', () => {
    it('should delete a group', async () => {
      const group = await createGroupUseCase.execute(validGroup);
      const result = await deleteGroupUseCase.execute(group.id!);
      expect(result).toBe(true);
    });

    it('should throw NotFoundError if group not found', async () => {
      const _id = new Types.ObjectId();
      await expect(deleteGroupUseCase.execute(_id.toString())).rejects.toThrow(new NotFoundError('Group Id'));
    });

    it('should throw UUIDError if group id is invalid', async () => {
      await expect(deleteGroupUseCase.execute('invalidId')).rejects.toThrow(new UUIDError());
    });
  });

  describe('findGroupsByRole', () => {
    it('should find groups by role', async () => {
      const role = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role description',
      });
      await createGroupUseCase.execute({
        ...validGroup,
        roles: [role.id!],
      });

      const groups = await findGroupsByRoleUseCase.execute(role.id!);
      expect(groups.length).toBe(1);
    });

    it('should resolve empty array if no groups found', async () => {
      const role = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role description',
      });
      const groups = await findGroupsByRoleUseCase.execute(role.id!);
      expect(groups).toEqual([]);
    });
  });

  describe('deleteAllRolesFromGroup', () => {
    it('should delete all roles from a group', async () => {
      const role1 = await createRoleUseCase.execute({
        name: 'Role 1',
        description: 'Role 1 description',
      });
      const role2 = await createRoleUseCase.execute({
        name: 'Role 2',
        description: 'Role 2 description',
      });

      const group = await createGroupUseCase.execute({
        ...validGroup,
        roles: [role1.id!, role2.id!],
      });

      const result = await deleteAllRolesFromGroupUseCase.execute(group.id!);
      expect(result).toBe(true);

      const groups = await findGroupsByRoleUseCase.execute(role1.id!);
      expect(groups.length).toBe(0);
      const groups2 = await findGroupsByRoleUseCase.execute(role2.id!);
      expect(groups2.length).toBe(0);
    });

    it('should throw NotFoundError if group not found', async () => {
      const _id = new Types.ObjectId();
      await expect(deleteAllRolesFromGroupUseCase.execute(_id.toString())).rejects.toThrow(
        new NotFoundError('Group Id'),
      );
    });
  });
});
