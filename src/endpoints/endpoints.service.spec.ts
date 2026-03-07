import { Test, TestingModule } from '@nestjs/testing';
import { EndpointsService } from './endpoints.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';

describe('EndpointsService', () => {
    let service: EndpointsService;

    const mockPrismaService = {
        endpoint: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockEndpoint = {
        id: 'uuid-endpoint-123',
        name: 'Test Endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        headers: null,
        body: null,
        interval: 5000,
        timeout: 10000,
        isActive: true,
        description: 'Test endpoint description',
        userId: 'uuid-user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EndpointsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<EndpointsService>(EndpointsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an endpoint successfully', async () => {
            const createDto: CreateEndpointDto = {
                name: 'Test Endpoint',
                url: 'https://api.example.com/health',
                method: 'GET',
                interval: 5000,
                timeout: 10000,
                userId: 'uuid-user-123',
            };

            mockPrismaService.endpoint.create.mockResolvedValue(mockEndpoint);

            const result = await service.create(createDto);

            expect(result).toEqual(mockEndpoint);
            expect(mockPrismaService.endpoint.create).toHaveBeenCalledWith({
                data: createDto,
            });
            expect(mockPrismaService.endpoint.create).toHaveBeenCalledTimes(1);
        });

        it('should create an endpoint with optional fields', async () => {
            const createDto: CreateEndpointDto = {
                name: 'Test Endpoint',
                url: 'https://api.example.com/health',
                method: 'POST',
                headers: '{"Authorization": "Bearer token"}',
                body: '{"key": "value"}',
                description: 'Test description',
                interval: 5000,
                timeout: 10000,
                userId: 'uuid-user-123',
            };

            const endpointWithOptionals = {
                ...mockEndpoint,
                headers: createDto.headers,
                body: createDto.body,
                description: createDto.description,
            };

            mockPrismaService.endpoint.create.mockResolvedValue(endpointWithOptionals);

            const result = await service.create(createDto);

            expect(result).toEqual(endpointWithOptionals);
            expect(result.headers).toBe(createDto.headers);
            expect(result.body).toBe(createDto.body);
            expect(result.description).toBe(createDto.description);
        });

        it('should propagate Prisma errors', async () => {
            const createDto: CreateEndpointDto = {
                name: 'Test Endpoint',
                url: 'https://api.example.com/health',
                method: 'GET',
                interval: 5000,
                timeout: 10000,
                userId: 'invalid-user-id',
            };

            const prismaError = new Error('Foreign key constraint failed');
            mockPrismaService.endpoint.create.mockRejectedValue(prismaError);

            await expect(service.create(createDto)).rejects.toThrow(prismaError);
        });
    });

    describe('findAll', () => {
        it('should return all endpoints', async () => {
            const endpoints = [
                mockEndpoint,
                { ...mockEndpoint, id: 'uuid-endpoint-456', name: 'Second Endpoint' },
            ];

            mockPrismaService.endpoint.findMany.mockResolvedValue(endpoints);

            const result = await service.findAll();

            expect(result).toEqual(endpoints);
            expect(result).toHaveLength(2);
            expect(mockPrismaService.endpoint.findMany).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no endpoints exist', async () => {
            mockPrismaService.endpoint.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe('findOne', () => {
        it('should return an endpoint by id', async () => {
            const id = 'uuid-endpoint-123';
            mockPrismaService.endpoint.findUnique.mockResolvedValue(mockEndpoint);

            const result = await service.findOne(id);

            expect(result).toEqual(mockEndpoint);
            expect(mockPrismaService.endpoint.findUnique).toHaveBeenCalledWith({
                where: { id },
            });
        });

        it('should return null if endpoint not found', async () => {
            const id = 'non-existent-id';
            mockPrismaService.endpoint.findUnique.mockResolvedValue(null);

            const result = await service.findOne(id);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update an endpoint', async () => {
            const id = 'uuid-endpoint-123';
            const updateDto: UpdateEndpointDto = { name: 'Updated Endpoint' };
            const updatedEndpoint = { ...mockEndpoint, name: 'Updated Endpoint' };

            mockPrismaService.endpoint.update.mockResolvedValue(updatedEndpoint);

            const result = await service.update(id, updateDto);

            expect(result).toEqual(updatedEndpoint);
            expect(mockPrismaService.endpoint.update).toHaveBeenCalledWith({
                where: { id },
                data: updateDto,
            });
        });

        it('should propagate error if endpoint not found', async () => {
            const id = 'non-existent-id';
            const updateDto: UpdateEndpointDto = { name: 'Updated Endpoint' };
            const prismaError = new Error('Record not found');

            mockPrismaService.endpoint.update.mockRejectedValue(prismaError);

            await expect(service.update(id, updateDto)).rejects.toThrow(prismaError);
        });
    });

    describe('remove', () => {
        it('should delete an endpoint', async () => {
            const id = 'uuid-endpoint-123';
            mockPrismaService.endpoint.delete.mockResolvedValue(mockEndpoint);

            const result = await service.remove(id);

            expect(result).toEqual(mockEndpoint);
            expect(mockPrismaService.endpoint.delete).toHaveBeenCalledWith({
                where: { id },
            });
        });

        it('should propagate error if endpoint not found', async () => {
            const id = 'non-existent-id';
            const prismaError = new Error('Record not found');

            mockPrismaService.endpoint.delete.mockRejectedValue(prismaError);

            await expect(service.remove(id)).rejects.toThrow(prismaError);
        });
    });
});
