import { Injectable } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EndpointsService {
  constructor(private readonly prisma: PrismaService) { }
  create(createEndpointDto: CreateEndpointDto) {
    return this.prisma.endpoint.create({
      data: createEndpointDto,
    });
  }

  findAll() {
    return this.prisma.endpoint.findMany();
  }

  findOne(id: string) {
    return this.prisma.endpoint.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEndpointDto: UpdateEndpointDto) {
    return this.prisma.endpoint.update({
      where: { id },
      data: updateEndpointDto,
    });
  }

  remove(id: string) {
    return this.prisma.endpoint.delete({
      where: { id },
    });
  }
}
