import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClient;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';

    this.client = createClient({ url });
    this.client.on('error', (err) => this.logger.error('Redis client error', err));
    this.client.on('connect', () => this.logger.log('Redis connected'));

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    if (value === null || value === undefined) return null;
    return value.toString();
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
