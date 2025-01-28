import rateLimit from 'express-rate-limit';
import {type Request, type Response} from 'express';

// Create different rate limiters for different endpoints
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More strict limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API endpoints limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 50 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many API requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom handler for rate limit exceeded
export const customRateLimitHandler = (req: Request, res: Response): void => {
  res.status(429).json({
    status: 'error',
    message: 'Rate limit exceeded',
    retryAfter: res.getHeader('Retry-After'),
    limit: res.getHeader('RateLimit-Limit'),
    remaining: res.getHeader('RateLimit-Remaining'),
    reset: res.getHeader('RateLimit-Reset'),
  });
};
