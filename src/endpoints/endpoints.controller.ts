import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { JwtAuthGuardUser } from 'src/auth/jwt.guards';
import { ApiResponse } from '@nestjs/swagger';
//import { RedisService } from 'src/redis/redis.service';

@Controller('endpoints')
export class EndpointsController {
  constructor(
    private readonly endpointsService: EndpointsService,
    //private readonly redis: RedisService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 201, description: 'Endpoint created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  create(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointsService.create(createEndpointDto);
  }

  @Get()
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoints retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Request() req) {
    return this.endpointsService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoint retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 404, description: 'Endpoint not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.endpointsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoint updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 404, description: 'Endpoint not found' })
  update(@Param('id') id: string, @Body() updateEndpointDto: UpdateEndpointDto, @Request() req) {
    return this.endpointsService.update(id, updateEndpointDto, req.user.userId);
  }

  // @Get(':id/status')
  // @UseGuards(JwtAuthGuardUser)
  // @ApiResponse({ status: 200, description: 'Cached status retrieved from Redis' })
  // @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  // @ApiResponse({ status: 404, description: 'Endpoint not found or no status cached yet' })
  // // async getStatus(@Param('id') id: string, @Request() req) {
  // //   // Verify ownership before touching Redis — never trust the cache alone
  // //   await this.endpointsService.findOne(id, req.user.userId);

  // //   const cached = await this.redis.get(`endpoint:${id}:status`);
  // //   if (!cached) {
  // //     throw new NotFoundException('No status cached yet — endpoint may not have been checked');
  // //   }

  // //   return JSON.parse(cached) as { isUp: boolean; responseTime: number; lastCheck: string };
  // // }

  @Delete(':id')
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoint deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 404, description: 'Endpoint not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.endpointsService.remove(id, req.user.userId);
  }
}
