import { ApiProperty } from '@nestjs/swagger';
import { HealthCheckResponseDto } from './HealthCheckResponse.dto';

export class HealthCheckStatsDto {
    @ApiProperty({
        description: 'Uptime percentage',
        example: 99.5,
    })
    uptimePercentage: number;

    @ApiProperty({
        description: 'Average response time in ms',
        example: 156,
    })
    averageResponseTime: number;

    @ApiProperty({
        description: 'Total number of checks performed',
        example: 1440,
    })
    totalChecks: number;

    @ApiProperty({
        description: 'Total number of successful checks',
        example: 1433,
    })
    successfulChecks: number;

    @ApiProperty({
        description: 'Total number of failed checks',
        example: 7,
    })
    failedChecks: number;

    @ApiProperty({
        description: 'Last check performed',
        type: HealthCheckResponseDto,
    })
    lastCheck: HealthCheckResponseDto;
}