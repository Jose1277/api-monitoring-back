import { Module } from '@nestjs/common';
import { HealthChecksService } from './health-checks.service';
import { HealthChecksController } from './health-checks.controller';

@Module({
  controllers: [HealthChecksController],
  providers: [HealthChecksService],
  exports: [HealthChecksService],
})
export class HealthChecksModule {}
