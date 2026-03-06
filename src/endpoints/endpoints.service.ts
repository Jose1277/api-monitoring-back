import { Injectable } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EndpointsService {
  constructor(private readonly prisma: PrismaService) { }
  create(createEndpointDto: CreateEndpointDto) {
    const { name, url, method, headers, body, description, userId } = createEndpointDto;
    return this.prisma.endpoint.create({
      data: {
        name,
        url,
        method,
        headers,
        body,
        description,
        userId,
      },
    });
  }

  findAll() {
    try {
      const endpoints = this.prisma.endpoint.findMany();
      return endpoints;
    }
    catch (error) {
      console.error("Error fetching endpoints:", error);
      throw new Error("Failed to fetch endpoints");
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} endpoint`;
  }

  update(id: number, updateEndpointDto: UpdateEndpointDto) {
    return `This action updates a #${id} endpoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} endpoint`;
  }
}
