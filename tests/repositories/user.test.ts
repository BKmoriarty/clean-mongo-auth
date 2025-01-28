import {MongoDBUserRepository} from '../../src/infrastructure/mongodb/repositories/user-repository';
import {User} from '../../src/domain/entities/user';

describe('UserRepository', () => {
  let repository: MongoDBUserRepository;

  beforeEach(() => {
    repository = new MongoDBUserRepository();
  });

  const mockUser: User = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    groupRoles: [],
  };

  describe('create', () => {
    it('should create a new user', async () => {
      const user = await repository.create(mockUser);

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(mockUser.email);
      expect(user.name).toBe(mockUser.name);
      // Password should not be returned
      expect(user).not.toHaveProperty('password');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      await repository.create(mockUser);
      const user = await repository.findByEmail(mockUser.email);

      expect(user).not.toBeNull();
      expect(user?.email).toBe(mockUser.email);
    });
  });
});
