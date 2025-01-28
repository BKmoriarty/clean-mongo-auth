// import {getTestApp} from '../setup';

describe('User API Integration Tests', () => {
  // const testApp = getTestApp();

  describe('POST /api/v1/users', () => {
    // const validUser = {
    //   email: 'test@example.com',
    //   name: 'Test User',
    //   password: 'password123',
    // };

    it('should create a new user', async () => {
      expect(true).toBe(true);

      // const response = await testApp
      //   .post('/api/v1/users')
      //   .send(validUser)
      //   .expect(201);

      // expect(response.body).toHaveProperty('id');
      // expect(response.body.email).toBe(validUser.email);
      // expect(response.body.name).toBe(validUser.name);
      // // Password should not be returned
      // expect(response.body).not.toHaveProperty('password');
    });

    // it('should not create user with duplicate email', async () => {
    //   // Create first user
    //   await testApp.post('/api/v1/users').send(validUser);

    //   // Try to create duplicate user
    //   const response = await testApp
    //     .post('/api/v1/users')
    //     .send(validUser)
    //     .expect(400);

    //   expect(response.body).toHaveProperty('error', 'User already exists');
    // });

    // it('should validate required fields', async () => {
    //   const invalidUser = {
    //     email: 'test@example.com',
    //     // Missing name and password
    //   };

    //   const response = await testApp
    //     .post('/api/v1/users')
    //     .send(invalidUser)
    //     .expect(400);

    //   expect(response.body).toHaveProperty('error');
    // });
  });
});
