import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MonitoringService } from './monitoring.service';
import { MonitoringGateway } from './monitoring.gateway';
import { HealthChecksModule } from 'src/health-checks/health-checks.module';

@Module({
  imports: [
    HealthChecksModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('JWT_EXPIRES_IN') ?? 3600 },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MonitoringService, MonitoringGateway],
})
export class MonitoringModule {}
