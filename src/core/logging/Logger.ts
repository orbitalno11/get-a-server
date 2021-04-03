import * as winston from 'winston';

const logLevel = (): string => {
  const env = process.env.environment || 'dev';
  const isDevelopment = env === 'dev';
  return isDevelopment ? 'debug' : 'warn';
};

const logger = winston.createLogger({
  level: logLevel(),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms ' }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.File({
      filename: './logs/all-logs.log',
      maxFiles: 5,
      maxsize: 5242880,
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      maxFiles: 5,
      maxsize: 5242880,
    }),
    new winston.transports.Console(),
  ],
});

export { logger };
