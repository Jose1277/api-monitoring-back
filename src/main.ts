import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const environment = process.env.NODE_ENV || 'development';
  const isDevelopment = environment === 'development';

  logger.log(`Starting application in ${environment.toUpperCase()} mode`);

  const app = await NestFactory.create(AppModule, {
    logger: isDevelopment
      ? ['log', 'debug', 'error', 'warn', 'verbose']
      : ['error', 'warn'],
  });

  const allowedOrigins = isDevelopment
    ? '*'
    : process.env.FRONTEND_URL?.split(',') || [];

  if (!isDevelopment && allowedOrigins.length === 0) {
    logger.error('FRONTEND_URL not configured in production');
    logger.error('Set FRONTEND_URL environment variable');
    process.exit(1);
  }
//cors
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  logger.log(`Application listening on port ${port}`);
  logger.log(`Environment: ${environment}`);
  logger.log(`Database: ${isDevelopment ? 'SQLite' : 'PostgreSQL'}`);
  logger.log(`CORS: ${Array.isArray(allowedOrigins) ? allowedOrigins.join(', ') : allowedOrigins}`);

  if (isDevelopment) {
    logger.log(`API: http://localhost:${port}/`);
    logger.log(`Prisma Studio: npx prisma studio`);
  }
}

bootstrap();