import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { HealthChecksService } from './health-checks.service';
import { JwtAuthGuardUser } from 'src/auth/jwt.guards';
import { ApiResponse } from '@nestjs/swagger';

@Controller('health-checks')
@UseGuards(JwtAuthGuardUser)
export class HealthChecksController {
  constructor(private readonly healthChecksService: HealthChecksService) {}

  @Get('endpoint/:id')
  @ApiResponse({ status: 200, description: 'Health check history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Endpoint not found' })
  async findByEndpoint(@Param('id') id: string, @Request() req) {
    await this.healthChecksService.verifyEndpointOwnership(id, req.user.userId);
    return this.healthChecksService.findByEndpoint(id);
  }

  @Get('endpoint/:id/stats')
  @ApiResponse({ status: 200, description: 'Health check stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Endpoint not found' })
  async getStats(@Param('id') id: string, @Request() req) {
    await this.healthChecksService.verifyEndpointOwnership(id, req.user.userId);
    return this.healthChecksService.getStats(id);
  }
}
