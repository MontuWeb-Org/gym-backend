import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AppConfig } from '@/config/app-config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor(private readonly config: AppConfig) {
    this.redis = new Redis({
      port: this.config.redis.port,
      host: this.config.redis.host,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('ready', () => {
      this.logger.log(`Connected to Redis at ${this.config.redis.host}:${this.config.redis.port}`);
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  getClient(): Redis {
    return this.redis;
  }
}
