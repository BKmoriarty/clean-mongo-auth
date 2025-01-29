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
import actuator from 'express-actuator';

export const createApp = () => {
  const app = express();

  const prefix = process.env.PREFIX || '/api/v1';

  // Global Middlewares
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS

  // Logging middleware
  app.use(morgan('combined', {stream})); // HTTP request logging with Winston
  app.use(loggingMiddleware); // Custom logging middleware

  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies

  // Express actuator
  app.use(actuator({basePath: `${prefix}/actuator`, infoGitMode: 'full'}));

  // Apply global rate limiter
  app.use(globalLimiter);

  // Dependencies
  const userRepository = new MongoDBUserRepository();
  const roleRepository = new MongoDBRoleRepository();
  const groupRepository = new MongoDBGroupRepository(roleRepository);

  // Routes
  app.use(prefix, userRouter(userRepository));
  app.use(prefix, roleRouter(roleRepository));
  app.use(prefix, groupRouter(groupRepository, roleRepository));

  // Health check endpoint
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('OK');
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
