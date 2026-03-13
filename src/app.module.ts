import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { HealthChecksModule } from './health-checks/health-checks.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    EndpointsModule,
    HealthChecksModule,
    MonitoringModule,
  ],
})
export class AppModule {}
