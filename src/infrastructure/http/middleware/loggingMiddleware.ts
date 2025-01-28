import type {Request, Response, NextFunction} from 'express';
import {logAPIRequest} from '../utils/logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Once the request is finished
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logAPIRequest(req, res, responseTime);
  });

  next();
};
