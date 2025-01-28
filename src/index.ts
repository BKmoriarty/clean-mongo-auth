import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import {createApp} from './infrastructure/http/app';

dotenv.config();

const start = async () => {
  try {
    const host_mongodb = process.env.MONGODB_HOST || 'localhost';
    const port_mongodb = process.env.MONGODB_PORT || 27017;
    const username_mongodb = process.env.MONGODB_USER;
    const password_mongodb = encodeURI(process.env.MONGODB_PASSWORD as string);
    const database_mongodb = process.env.MONGODB_DATABASE || 'mydb';

    const url = `mongodb://${username_mongodb}:${password_mongodb}@${host_mongodb}:${port_mongodb}`;
    // console.log(`Connecting to MongoDB at ${url}`);

    await mongoose
      .connect(url, {
        dbName: database_mongodb,
      })
      .then(() => {
        console.log('Connected to MongoDB');
      });

    const app = createApp();
    const port = process.env.PORT || 8080;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
};

void start();
