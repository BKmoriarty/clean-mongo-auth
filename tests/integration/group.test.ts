import {MongoDBRoleRepository} from '@/infrastructure/mongodb/repositories/role-repository';
import {getTestApp} from '../setup';
import {CreateGroupUseCase} from '@/domain/usecases/group/CRUD/create-group';
import {MongoDBGroupRepository} from '@/infrastructure/mongodb/repositories/group-repository';
import {Types} from 'mongoose';

describe('Group API Integration Tests', () => {
  const testApp = getTestApp();

  let repository: MongoDBGroupRepository;
  let roleRepository: MongoDBRoleRepository;
  let createGroupUseCase: CreateGroupUseCase;

  beforeEach(() => {
    roleRepository = new MongoDBRoleRepository();
    repository = new MongoDBGroupRepository(roleRepository);

    createGroupUseCase = new CreateGroupUseCase(repository, roleRepository);
  });

  const validGroup = {
    name: 'Group 1',
    description: 'Group 1 description',
    roles: [],
  };

  describe('POST /api/v1/groups', () => {
    it('should respond with 201 and create a new group', async () => {
      const response = await testApp.post('/api/v1/groups').send(validGroup).expect(201);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Group created successfully');
      expect(response.body.data.name).toBe(validGroup.name);
      expect(response.body.data.description).toBe(validGroup.description);
    });

    it('should respond with 409 and not create group with duplicate name', async () => {
      await testApp.post('/api/v1/groups').send(validGroup);

      const response = await testApp.post('/api/v1/groups').send(validGroup).expect(409);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Group Name already exists');
      expect(response.body.code).toBe('ConflictError');
    });
  });

  describe('GET /api/v1/groups', () => {
    it('should respond with 200 and return all groups', async () => {
      await createGroupUseCase.execute(validGroup);

      const response = await testApp.get('/api/v1/groups').expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe(validGroup.name);
      expect(response.body.data[0].description).toBe(validGroup.description);
    });
  });

  describe('GET /api/v1/groups?id=:id', () => {
    it('should respond with 200 and return group by id', async () => {
      const group = await createGroupUseCase.execute(validGroup);

      const response = await testApp.get(`/api/v1/groups?id=${group.id}`).expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(validGroup.name);
      expect(response.body.data.description).toBe(validGroup.description);
    });

    it('should respond with 404 and not find group by id', async () => {
      const _id = new Types.ObjectId();

      const response = await testApp.get(`/api/v1/groups?id=${_id.toString()}`).expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Group Id not found');
    });

    it('should respond with 400 and not find group by invalid id', async () => {
      const response = await testApp.get('/api/v1/groups?id=invalid-id').expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid UUID');
    });
  });

  describe('GET /api/v1/groups?name=:name', () => {
    it('should respond with 200 and return group by name', async () => {
      const group = await createGroupUseCase.execute(validGroup);

      const response = await testApp.get(`/api/v1/groups?name=${group.name}`).expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(validGroup.name);
      expect(response.body.data.description).toBe(validGroup.description);
    });

    it('should respond with 404 and not find group by name', async () => {
      const response = await testApp.get('/api/v1/groups?name=invalid-name').expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Group Name not found');
    });
  });

  describe('PUT /api/v1/groups/:id', () => {
    it('should respond with 200 and update group by id', async () => {
      const group = await createGroupUseCase.execute(validGroup);

      const updatedGroup = {
        name: 'Group 2',
        description: 'Group 2 description',
      };

      const response = await testApp.put(`/api/v1/groups/${group.id}`).send(updatedGroup).expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Group updated successfully');
      expect(response.body.data.name).toBe(updatedGroup.name);
      expect(response.body.data.description).toBe(updatedGroup.description);
    });

    it('should respond with 404 and not find group by id', async () => {
      const _id = new Types.ObjectId();

      const response = await testApp.put(`/api/v1/groups/${_id.toString()}`).send(validGroup).expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Group Id not found');
    });

    it('should respond with 400 and not find group by invalid id', async () => {
      const response = await testApp.put('/api/v1/groups/invalid-id').send(validGroup).expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid UUID');
    });
  });

  describe('DELETE /api/v1/groups/:id', () => {
    it('should respond with 200 and delete group by id', async () => {
      const group = await createGroupUseCase.execute(validGroup);

      const response = await testApp.delete(`/api/v1/groups/${group.id}`).expect(204);

      expect(response.body).not.toHaveProperty('status');
      expect(response.body).not.toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');
    });

    it('should respond with 404 and not find group by id', async () => {
      const _id = new Types.ObjectId();

      const response = await testApp.delete(`/api/v1/groups/${_id.toString()}`).expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Group Id not found');
    });

    it('should respond with 400 and not find group by invalid id', async () => {
      const response = await testApp.delete('/api/v1/groups/invalid-id').expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid UUID');
    });
  });
});
