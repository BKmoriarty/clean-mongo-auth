import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define different colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Tell winston that we want to link specific colors with specific log levels
winston.addColors(colors);

// Define the format for our logs
const format = winston.format.combine(
  // Add timestamp
  winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
  // Add errors stack trace
  winston.format.errors({stack: true}),
  // Add colorization when logging to console
  winston.format.colorize({all: true}),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`,
  ),
);

// Define which transports we want to use for our logger
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console(),

  // Error logs
  new DailyRotateFile({
    dirname: path.join(process.cwd(), 'logs', 'error'),
    filename: 'error-%DATE%.log',
    level: 'error',
    format: winston.format.combine(winston.format.uncolorize(), winston.format.json()),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),

  // All logs
  new DailyRotateFile({
    dirname: path.join(process.cwd(), 'logs', 'combined'),
    filename: 'combined-%DATE%.log',
    format: winston.format.combine(winston.format.uncolorize(), winston.format.json()),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

// Create a stream object with a 'write' function that will be used by Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Function to log detailed error information
export const logError = (error: any, req?: any) => {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(req && {
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        ip: req.ip,
        user: req.user, // If you have user authentication
      },
    }),
  };

  logger.error(JSON.stringify(errorDetails));
};

// Function to log API requests
export const logAPIRequest = (req: any, res: any, responseTime: number) => {
  const logDetails = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    user: req.user?.id, // If you have user authentication
  };

  logger.info(JSON.stringify(logDetails));
};

export default logger;
