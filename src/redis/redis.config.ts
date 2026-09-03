import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
    port: +process.env.REDIS_PORT! || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD,
    ttl: +process.env.REDIS_DEFAULT_TTL! || 86400
}));