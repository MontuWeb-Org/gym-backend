import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import redisConfig from './redis.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly config: ConfigType<typeof redisConfig>,
  ) {
    this.redis = new Redis({
      port: this.config.port,
      host: this.config.host,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('ready', () => {
      this.logger.log(`Connected to Redis at ${this.config.host}:${this.config.port}`);
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
