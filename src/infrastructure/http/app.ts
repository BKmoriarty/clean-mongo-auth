import express, {type Request, type Response, type NextFunction} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {MongoDBUserRepository} from '../mongodb/repositories/user-repository';
import {userRouter} from './routes/user-routes';
import {errorHandler} from './middleware/errorHandler';
import {globalLimiter} from './middleware/rateLimiter';
import {loggingMiddleware} from './middleware/loggingMiddleware';
import logger, {stream} from './utils/logger';
import {AppError} from './utils/errors';
import {roleRouter} from './routes/role-routes';
import {MongoDBRoleRepository} from '../mongodb/repositories/role-repository';
import {MongoDBGroupRepository} from '../mongodb/repositories/group-repository';
import {groupRouter} from './routes/group-routes';

export const createApp = () => {
  const app = express();

  // Global Middlewares
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS

  // Logging middleware
  app.use(morgan('combined', {stream})); // HTTP request logging with Winston
  app.use(loggingMiddleware); // Custom logging middleware

  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies

  // Apply global rate limiter
  app.use(globalLimiter);

  // Dependencies
  const userRepository = new MongoDBUserRepository();
  const roleRepository = new MongoDBRoleRepository();
  const groupRepository = new MongoDBGroupRepository(roleRepository);

  // Routes
  app.use('/api/v1', userRouter(userRepository));
  app.use('/api/v1', roleRouter(roleRepository));
  app.use('/api/v1', groupRouter(groupRepository, roleRepository));

  // Health check endpoint
  app.get('/api/v1/health', (req: Request, res: Response) => {
    logger.info('Health check endpoint called');
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
    });
  });

  // 404 handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    logger.warn(`404 Not Found: ${req.originalUrl}`);
    next(error);
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
};
