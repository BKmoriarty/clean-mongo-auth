import {MongoDBRoleRepository} from '@/infrastructure/mongodb/repositories/role-repository';
import {getTestApp} from '../setup';
import {CreateRoleUseCase} from '@/domain/usecases/role/create-role';
import {Types} from 'mongoose';

describe('Role API Integration Tests', () => {
  const testApp = getTestApp();

  let repository: MongoDBRoleRepository;
  let createRoleUseCase: CreateRoleUseCase;

  beforeEach(() => {
    repository = new MongoDBRoleRepository();

    createRoleUseCase = new CreateRoleUseCase(repository);
  });

  const validRole = {
    name: 'Admin',
    level: 1,
    description: 'Admin role',
  };

  describe('POST /api/v1/roles', () => {
    it('should respond with 201 and create a new role', async () => {
      const response = await testApp.post('/api/v1/roles').send(validRole).expect(201);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Role created successfully');
      expect(response.body.data.name).toBe(validRole.name);
      expect(response.body.data.description).toBe(validRole.description);
    });

    it('should respond with 409 and not create role with duplicate name', async () => {
      await testApp.post('/api/v1/roles').send(validRole);

      const response = await testApp.post('/api/v1/roles').send(validRole).expect(409);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Role Name already exists');
      expect(response.body.code).toBe('ConflictError');
    });
  });

  describe('GET /api/v1/roles', () => {
    it('should respond with 200 and return all roles', async () => {
      await createRoleUseCase.execute(validRole);

      const response = await testApp.get('/api/v1/roles').expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Role found successfully');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0].name).toBe(validRole.name);
      expect(response.body.data[0].description).toBe(validRole.description);
    });
  });

  describe('GET /api/v1/roles?id=:id', () => {
    it('should respond with 200 and return a role by id', async () => {
      const role = await createRoleUseCase.execute(validRole);

      const response = await testApp.get(`/api/v1/roles?id=${role.id}`).expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Role found successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validRole.name);
      expect(response.body.data.description).toBe(validRole.description);
    });

    it('should respond with 404 and not find a role by id', async () => {
      const _id = new Types.ObjectId();

      const response = await testApp.get(`/api/v1/roles?id=${_id.toString()}`).expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Role Id not found');
    });

    it('should respond with 400 and not find a role by invalid id', async () => {
      const response = await testApp.get('/api/v1/roles?id=invalidId').expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid UUID');
    });
  });

  describe('GET /api/v1/roles/name?name=', () => {
    it('should respond with 200 and return a role by name', async () => {
      const role = await createRoleUseCase.execute(validRole);

      const response = await testApp.get(`/api/v1/roles?name=${role.name}`).expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Role found successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(role.name);
      expect(response.body.data.description).toBe(role.description);
    });

    it('should respond with 404 and not find a role by name', async () => {
      const response = await testApp.get('/api/v1/roles?name=nonexistentName').expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Role Name not found');
    });
  });

  describe('PUT /api/v1/roles/:id', () => {
    it('should respond with 200 and update a role by id', async () => {
      const role = await createRoleUseCase.execute(validRole);

      const response = await testApp.put(`/api/v1/roles/${role.id}`).send({name: 'Updated Name'}).expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Role updated successfully');
      expect(response.body.data.name).toBe('Updated Name');
    });

    it('should respond with 404 and not update a role by id', async () => {
      const _id = new Types.ObjectId();

      const response = await testApp.put(`/api/v1/roles/${_id.toString()}`).send({name: 'Updated Name'}).expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Role Id not found');
    });

    it('should respond with 400 and not update a role by invalid id', async () => {
      const response = await testApp.put('/api/v1/roles/invalidId').send({name: 'Updated Name'}).expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid UUID');
    });
  });

  describe('DELETE /api/v1/roles/:id', () => {
    it('should respond with 200 and delete a role by id', async () => {
      const role = await createRoleUseCase.execute(validRole);

      const response = await testApp.delete(`/api/v1/roles/${role.id}`).expect(204);

      expect(response.body).not.toHaveProperty('status');
      expect(response.body).not.toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');
    });

    it('should respond with 404 and not delete a role by id', async () => {
      const _id = new Types.ObjectId();

      const response = await testApp.delete(`/api/v1/roles/${_id.toString()}`).expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Role Id not found');
    });

    it('should respond with 400 and not delete a role by invalid id', async () => {
      const response = await testApp.delete('/api/v1/roles/invalidId').expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid UUID');
    });
  });
});
