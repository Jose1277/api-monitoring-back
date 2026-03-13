import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHealthCheckDto } from './dto/create-health-check.dto';
import { HealthCheckResponseDto } from './dto/HealthCheckResponse.dto';
import { HealthCheckStatsDto } from './dto/HealthCheckStats.dto';

@Injectable()
export class HealthChecksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateHealthCheckDto): Promise<HealthCheckResponseDto> {
    return this.prisma.healthCheck.create({ data });
  }

  async findByEndpoint(endpointId: string): Promise<HealthCheckResponseDto[]> {
    return this.prisma.healthCheck.findMany({
      where: { endpointId },
      orderBy: { checkedAt: 'desc' },
      take: 100,
    });
  }

  async getStats(endpointId: string): Promise<HealthCheckStatsDto> {
    const checks = await this.prisma.healthCheck.findMany({
      where: { endpointId },
      orderBy: { checkedAt: 'desc' },
    });

    if (checks.length === 0) {
      throw new NotFoundException('No health checks found for this endpoint');
    }

    const totalChecks = checks.length;
    const successfulChecks = checks.filter((c) => c.isUp).length;
    const failedChecks = totalChecks - successfulChecks;
    const uptimePercentage = (successfulChecks / totalChecks) * 100;
    const averageResponseTime =
      checks.reduce((sum, c) => sum + c.responseTime, 0) / totalChecks;

    const lastCheck = checks[0];

    return {
      uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime),
      totalChecks,
      successfulChecks,
      failedChecks,
      lastCheck,
    };
  }

  async verifyEndpointOwnership(endpointId: string, userId: string): Promise<void> {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: { id: endpointId, userId },
    });

    if (!endpoint) {
      throw new NotFoundException('Endpoint not found');
    }
  }
}
