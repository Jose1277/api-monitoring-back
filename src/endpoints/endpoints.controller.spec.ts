import { Test, TestingModule } from '@nestjs/testing';
import { EndpointsController } from './endpoints.controller';
import { EndpointsService } from './endpoints.service';
import { RedisService } from '../redis/redis.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';

describe('EndpointsController', () => {
    let controller: EndpointsController;

    const mockEndpointsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockRedisService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    const mockReq = { user: { userId: 'uuid-user-123' } };

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
            controllers: [EndpointsController],
            providers: [
                { provide: EndpointsService, useValue: mockEndpointsService },
                { provide: RedisService, useValue: mockRedisService },
            ],
        }).compile();

        controller = module.get<EndpointsController>(EndpointsController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create an endpoint', async () => {
            const createDto: CreateEndpointDto = {
                name: 'Test Endpoint',
                url: 'https://api.example.com/health',
                method: 'GET',
                interval: 5000,
                timeout: 10000,
                userId: 'uuid-user-123',
            };

            mockEndpointsService.create.mockResolvedValue(mockEndpoint);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockEndpoint);
            expect(mockEndpointsService.create).toHaveBeenCalledWith(createDto);
            expect(mockEndpointsService.create).toHaveBeenCalledTimes(1);
        });

        it('should pass optional fields to service', async () => {
            const createDto: CreateEndpointDto = {
                name: 'Test Endpoint',
                url: 'https://api.example.com/health',
                method: 'POST',
                headers: '{"Content-Type": "application/json"}',
                body: '{"test": true}',
                description: 'A test endpoint',
                interval: 5000,
                timeout: 10000,
                userId: 'uuid-user-123',
            };

            const endpointWithOptionals = {
                ...mockEndpoint,
                method: 'POST',
                headers: createDto.headers,
                body: createDto.body,
                description: createDto.description,
            };

            mockEndpointsService.create.mockResolvedValue(endpointWithOptionals);

            const result = await controller.create(createDto);

            expect(result.headers).toBe(createDto.headers);
            expect(result.body).toBe(createDto.body);
            expect(result.description).toBe(createDto.description);
        });
    });

    describe('findAll', () => {
        it('should return all endpoints', async () => {
            const endpoints = [
                mockEndpoint,
                { ...mockEndpoint, id: 'uuid-endpoint-456', name: 'Second Endpoint' },
            ];

            mockEndpointsService.findAll.mockResolvedValue(endpoints);

            const result = await controller.findAll(mockReq);

            expect(result).toEqual(endpoints);
            expect(result).toHaveLength(2);
            expect(mockEndpointsService.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no endpoints', async () => {
            mockEndpointsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll(mockReq);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe('findOne', () => {
        it('should return an endpoint by id', async () => {
            const id = 'uuid-endpoint-123';
            mockEndpointsService.findOne.mockResolvedValue(mockEndpoint);

            const result = await controller.findOne(id, mockReq);

            expect(result).toEqual(mockEndpoint);
            expect(mockEndpointsService.findOne).toHaveBeenCalledWith(id, mockReq.user.userId);
        });

        it('should return null if endpoint not found', async () => {
            const id = 'non-existent-id';
            mockEndpointsService.findOne.mockResolvedValue(null);

            const result = await controller.findOne(id, mockReq);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update an endpoint', async () => {
            const id = 'uuid-endpoint-123';
            const updateDto: UpdateEndpointDto = { name: 'Updated Endpoint' };
            const updatedEndpoint = { ...mockEndpoint, name: 'Updated Endpoint' };

            mockEndpointsService.update.mockResolvedValue(updatedEndpoint);

            const result = await controller.update(id, updateDto, mockReq);

            expect(result).toEqual(updatedEndpoint);
            expect(mockEndpointsService.update).toHaveBeenCalledWith(id, updateDto, mockReq.user.userId);
        });
    });

    describe('remove', () => {
        it('should remove an endpoint', async () => {
            const id = 'uuid-endpoint-123';
            mockEndpointsService.remove.mockResolvedValue(mockEndpoint);

            const result = await controller.remove(id, mockReq);

            expect(result).toEqual(mockEndpoint);
            expect(mockEndpointsService.remove).toHaveBeenCalledWith(id, mockReq.user.userId);
        });
    });
});
