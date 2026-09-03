import { Global, Module } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { ConfigModule } from '@nestjs/config';
import redisConfig from '@/redis/redis.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
