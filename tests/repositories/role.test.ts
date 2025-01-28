import {RoleCreate} from '@/domain/entities/role';
import {CreateRoleUseCase} from '@/domain/usecases/role/create-role';
import {DeleteRoleUseCase} from '@/domain/usecases/role/delete-role';
import {FindAllRoleUseCase} from '@/domain/usecases/role/findAll-role';
import {FindByIdRoleUseCase} from '@/domain/usecases/role/findById-role';
import {FindByNameRoleUseCase} from '@/domain/usecases/role/findByName-role';
import {UpdateRoleUseCase} from '@/domain/usecases/role/update-role';
import {
  ConflictError,
  NotFoundError,
  UUIDError,
} from '@/infrastructure/http/utils/errors';
import {MongoDBRoleRepository} from '@/infrastructure/mongodb/repositories/role-repository';
import {Types} from 'mongoose';

describe('RoleRepository', () => {
  let repository: MongoDBRoleRepository;
  let createRoleUseCase: CreateRoleUseCase;
  let findAllUseCase: FindAllRoleUseCase;
  let findByIdUseCase: FindByIdRoleUseCase;
  let findByNameUseCase: FindByNameRoleUseCase;
  let updateRoleUseCase: UpdateRoleUseCase;
  let deleteRoleUseCase: DeleteRoleUseCase;

  beforeEach(() => {
    repository = new MongoDBRoleRepository();

    createRoleUseCase = new CreateRoleUseCase(repository);
    findAllUseCase = new FindAllRoleUseCase(repository);
    findByIdUseCase = new FindByIdRoleUseCase(repository);
    findByNameUseCase = new FindByNameRoleUseCase(repository);
    updateRoleUseCase = new UpdateRoleUseCase(repository);
    deleteRoleUseCase = new DeleteRoleUseCase(repository);
  });

  const mockRole: RoleCreate = {
    name: 'Admin',
    description: 'Admin role',
  };

  describe('create', () => {
    it('should create a new role', async () => {
      const role = await createRoleUseCase.execute(mockRole);

      expect(role).toHaveProperty('id');
      expect(role.name).toBe(mockRole.name);
      expect(role.description).toBe(mockRole.description);
    });

    it('should throw ConflictError if role name already exists', async () => {
      await createRoleUseCase.execute(mockRole);
      await expect(createRoleUseCase.execute(mockRole)).rejects.toThrow(
        new ConflictError('Role Name'),
      );
    });
  });

  describe('findAll', () => {
    it('should return empty array', async () => {
      const roles = await findAllUseCase.execute();
      expect(roles).toEqual([]);
    });

    it('should return all roles', async () => {
      await createRoleUseCase.execute(mockRole);
      const roles = await findAllUseCase.execute();
      expect(roles.length).toBe(1);
    });
  });

  describe('findById', () => {
    it('should find a role by id', async () => {
      const role = await createRoleUseCase.execute(mockRole);
      const foundRole = await findByIdUseCase.execute(role.id!);

      expect(foundRole).toHaveProperty('id');
      expect(foundRole?.name).toBe(mockRole.name);
      expect(foundRole?.description).toBe(mockRole.description);
    });

    it('should throw NotFoundError if role not found', async () => {
      const _id = new Types.ObjectId();
      await expect(findByIdUseCase.execute(_id.toString())).rejects.toThrow(
        new NotFoundError('Role Id'),
      );
    });

    it('should throw UUIDError if role id is invalid', async () => {
      await expect(findByIdUseCase.execute('invalidId')).rejects.toThrow(
        new UUIDError(),
      );
    });
  });

  describe('findByName', () => {
    it('should find a role by name', async () => {
      const role = await createRoleUseCase.execute(mockRole);
      const foundRole = await findByNameUseCase.execute(role.name!);

      expect(foundRole).toHaveProperty('id');
      expect(foundRole?.name).toBe(mockRole.name);
      expect(foundRole?.description).toBe(mockRole.description);
    });

    it('should throw NotFoundError if role not found', async () => {
      await expect(
        findByNameUseCase.execute('nonexistentName'),
      ).rejects.toThrow(new NotFoundError('Role Name'));
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const role = await createRoleUseCase.execute(mockRole);
      const updatedRole = await updateRoleUseCase.execute(role.id!, {
        name: 'Updated Name',
      });

      expect(updatedRole).toHaveProperty('id');
      expect(updatedRole?.name).toBe('Updated Name');
    });

    it('should throw NotFoundError if role not found', async () => {
      const _id = new Types.ObjectId();
      await expect(
        updateRoleUseCase.execute(_id.toString(), {name: 'Updated Name'}),
      ).rejects.toThrow(new NotFoundError('Role Id'));
    });

    it('should throw UUIDError if role id is invalid', async () => {
      await expect(
        updateRoleUseCase.execute('invalidId', {name: 'Updated Name'}),
      ).rejects.toThrow(new UUIDError());
    });

    it('should throw ConflictError if role name already exists', async () => {
      await createRoleUseCase.execute(mockRole);
      const role = await createRoleUseCase.execute({
        name: 'New Role',
        description: 'New Role',
      });
      await expect(
        updateRoleUseCase.execute(role.id!, {name: mockRole.name}),
      ).rejects.toThrow(new ConflictError('Role Name'));
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      const role = await createRoleUseCase.execute(mockRole);
      const result = await deleteRoleUseCase.execute(role.id!);
      expect(result).toBe(true);
    });

    it('should throw NotFoundError if role not found', async () => {
      const _id = new Types.ObjectId();
      await expect(deleteRoleUseCase.execute(_id.toString())).rejects.toThrow(
        new NotFoundError('Role Id'),
      );
    });

    it('should throw UUIDError if role id is invalid', async () => {
      await expect(deleteRoleUseCase.execute('invalidId')).rejects.toThrow(
        new UUIDError(),
      );
    });
  });
});
