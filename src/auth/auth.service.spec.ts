import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
    let service: AuthService;
    let prisma: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'Test@1234',
                name: 'Test User',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue({
                id: 'uuid-123',
                email: registerDto.email,
                name: registerDto.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockJwtService.sign.mockReturnValue('mock_token');

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('user');
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: registerDto.email },
            });
        });

        it('should throw ConflictException if email exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'Test@1234',
                name: 'Existing User',
            };

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'uuid-existing',
                email: registerDto.email,
            });

            await expect(service.register(registerDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'Test@1234',
            };

            const hashedPassword = await bcrypt.hash(loginDto.password, 10);

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'uuid-123',
                email: loginDto.email,
                password: hashedPassword,
                name: 'Test User',
            });
            mockJwtService.sign.mockReturnValue('mock_token');

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('access_token', 'mock_token');
            expect(result).toHaveProperty('user');
        });

        it('should throw UnauthorizedException with invalid password', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'WrongPassword',
            };

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'uuid-123',
                email: loginDto.email,
                password: await bcrypt.hash('Test@1234', 10),
            });

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});