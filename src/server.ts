import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { logger } from './config/logger.js';

const PORT = Number(env.PORT) || 5000;

// Capture des exceptions non gérées au niveau Node.js
process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down... %o', error);
  process.exit(1);
});

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('✅ Base de données PostgreSQL connectée via Prisma');

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
      logger.info(`🌍 Environnement : ${env.NODE_ENV}`);
    });

    // Capture des rejets de promesses non gérés
    process.on('unhandledRejection', (reason: any) => {
      logger.error('UNHANDLED REJECTION! Shutting down... %o', reason);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error('❌ Échec du démarrage du serveur : %o', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();