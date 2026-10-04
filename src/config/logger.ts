import winston from 'winston';
import path from 'path';
import { env } from './env.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'btp-backend' },
  transports: [
    // Écriture des erreurs critiques dans un fichier dédié
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    // Écriture de l'ensemble des logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
});

// Affichage en console si nous ne sommes pas en environnement de test
if (env.NODE_ENV !== 'test') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}