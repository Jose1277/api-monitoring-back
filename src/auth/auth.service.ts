import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerPayload: RegisterDTO) {
        const { email, password, name } = registerPayload;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            }
        });

        const access_token = this.generateToken(user);
        return {
            user,
            message: 'User registered successfully',
            access_token
        }
    }

    async validateUser(loginPayload: LoginDTO) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginPayload.email },
        });

        if (user && await bcrypt.compare(loginPayload.password, user.password)) {
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(loginPayload: LoginDTO) {
        const user = await this.validateUser(loginPayload);

        const access_token = this.generateToken(user);

        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        };
    }

    private generateToken(user: { id: string; email: string, name?: string }) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.name || user.email
        };
        return this.jwtService.sign(payload);
    };

    async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            }
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }
}