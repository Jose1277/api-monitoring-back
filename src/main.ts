import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const environment = process.env.NODE_ENV || 'development';
  const isDevelopment = environment === 'development';

  logger.log(`🚀 Starting application in ${environment.toUpperCase()} mode`);

  const app = await NestFactory.create(AppModule, {
    logger: isDevelopment
      ? ['log', 'debug', 'error', 'warn', 'verbose']
      : ['error', 'warn'],
  });

  // CORS
  app.enableCors({
    origin: isDevelopment
      ? '*' // Dev
      : process.env.FRONTEND_URL || 'https://frontend-url.com/', // Prod
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  logger.log(`Environment: ${environment}`);
  logger.log(`Database: ${isDevelopment ? 'SQLite' : 'PostgreSQL'}`);
  logger.log(`API: http://localhost:${port}/api`);

  if (isDevelopment) {
    logger.log(`Prisma Studio: Run 'npx prisma studio' to open`);
  }
}

bootstrap();
