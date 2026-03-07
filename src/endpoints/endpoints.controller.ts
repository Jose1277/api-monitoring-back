import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { JwtAuthGuardUser } from 'src/auth/jwt.guards';
import { ApiResponse } from '@nestjs/swagger';

@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) { }

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
  findAll() {
    return this.endpointsService.findAll();
  }

  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoint retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.endpointsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoint updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateEndpointDto: UpdateEndpointDto) {
    return this.endpointsService.update(id, updateEndpointDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuardUser)
  @ApiResponse({ status: 200, description: 'Endpoint deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.endpointsService.remove(id);
  }
}
