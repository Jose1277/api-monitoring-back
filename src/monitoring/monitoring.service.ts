// src/monitoring/monitoring.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { HealthChecksService } from 'src/health-checks/health-checks.service';
import { MonitoringGateway } from './monitoring.gateway';
// import { RedisService } from 'src/redis/redis.service';

const STATUS_TTL_SECONDS = 300; // 5 minutes

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly healthChecksService: HealthChecksService,
    private readonly gateway: MonitoringGateway,

  ) { }

  @Cron('*/30 * * * * *')
  async performChecks() {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { isActive: true },
    });

    this.logger.log(`Running checks for ${endpoints.length} active endpoints`);

    await Promise.allSettled(endpoints.map((endpoint) => this.checkEndpoint(endpoint)));
  }

  private async checkEndpoint(endpoint: {
    id: string;
    url: string;
    method: string;
    headers: unknown;
    body: string | null;
    timeout: number;
    userId: string;
  }) {
    const start = Date.now();

    try {
      const response = await axios({
        method: endpoint.method.toLowerCase(),
        url: endpoint.url,
        headers: (endpoint.headers as Record<string, string>) ?? {},
        data: endpoint.body ?? undefined,
        timeout: endpoint.timeout,
        validateStatus: () => true,
      });

      const responseTime = Date.now() - start;
      const isUp = response.status >= 200 && response.status < 400;
      const checkedAt = new Date();

      await this.healthChecksService.create({
        endpointId: endpoint.id,
        statusCode: response.status,
        responseTime,
        isUp,
        checkDuration: responseTime,
      });

      // await this.cacheStatus(endpoint.id, { isUp, responseTime, lastCheck: checkedAt }); 

      this.gateway.emitCheckUpdate(endpoint.userId, {
        endpointId: endpoint.id,
        isUp,
        responseTime,
        checkedAt,
      });

      this.logger.debug(
        `[${endpoint.id}] ${endpoint.url} → ${response.status} (${responseTime}ms)`,
      );
    } catch (err) {
      const responseTime = Date.now() - start;
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorType = this.getErrorType(err);
      const checkedAt = new Date();

      await this.healthChecksService.create({
        endpointId: endpoint.id,
        responseTime,
        isUp: false,
        errorMessage,
        errorType,
        checkDuration: responseTime,
      });

      // await this.cacheStatus(endpoint.id, { isUp: false, responseTime, lastCheck: checkedAt }); 

      this.gateway.emitCheckUpdate(endpoint.userId, {
        endpointId: endpoint.id,
        isUp: false,
        responseTime,
        checkedAt,
      });

      this.logger.warn(`[${endpoint.id}] ${endpoint.url} → ERROR: ${errorMessage}`);
    }
  }
  // redis caching for future 
  // private async cacheStatus(
  //   endpointId: string,
  //   status: { isUp: boolean; responseTime: number; lastCheck: Date },
  // ) {
  //   try {
  //     await this.redis.set(
  //       `endpoint:${endpointId}:status`,
  //       JSON.stringify(status),
  //       STATUS_TTL_SECONDS,
  //     );
  //   } catch (err) {
  //     this.logger.error(`Failed to cache status for endpoint ${endpointId}`, err);
  //   }
  // }

  private getErrorType(err: unknown): string {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') return 'TIMEOUT';
      if (err.code === 'ECONNREFUSED') return 'ECONNREFUSED';
      if (err.code === 'ENOTFOUND') return 'DNS_ERROR';
      return err.code ?? 'AXIOS_ERROR';
    }
    return 'UNKNOWN_ERROR';
  }
}