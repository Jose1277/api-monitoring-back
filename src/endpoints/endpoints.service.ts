import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { EndpointResponseDto } from './dto/endpoint-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EndpointsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createEndpointDto: CreateEndpointDto) {
    return this.prisma.endpoint.create({
      data: createEndpointDto,
    });
  }

  async findAll(userId: string): Promise<EndpointResponseDto[]> {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { userId },
    });

    return endpoints.map((endpoint) => ({
      ...endpoint,
      headers: this.toHeadersRecord(endpoint.headers),
    }));
  }

  private toHeadersRecord(headers: unknown): Record<string, string> {
    if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(headers as Record<string, unknown>).map(([key, value]) => [key, String(value)]),
    );
  }

  async findOne(id: string, userId: string): Promise<EndpointResponseDto> {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: { id, userId },
    });

    if (!endpoint) {
      throw new NotFoundException('Endpoint not found');
    }

    return {
      ...endpoint,
      headers: this.toHeadersRecord(endpoint.headers),
    };
  }

  async update(id: string, updateEndpointDto: UpdateEndpointDto, userId: string) {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: { id, userId },
    });

    if (!endpoint) {
      throw new NotFoundException('Endpoint not found');
    }

    return this.prisma.endpoint.update({
      where: { id },
      data: updateEndpointDto,
    });
  }

  async remove(id: string, userId: string) {
    const endpoint = await this.prisma.endpoint.findFirst({
      where: { id, userId },
    });

    if (!endpoint) {
      throw new NotFoundException('Endpoint not found');
    }

    return this.prisma.endpoint.delete({
      where: { id },
    });
  }
}
