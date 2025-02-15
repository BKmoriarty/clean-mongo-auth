import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {createApp} from '../src/infrastructure/http/app';
import supertest from 'supertest';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

export const getTestApp = () => {
  return supertest(createApp());
};
