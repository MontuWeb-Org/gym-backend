import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().optional().default(3000),
    DATABASE_URL: z.url(),
    REDIS_PORT: z.coerce.number().optional().default(6379),
});

const parsedEnv = envSchema.parse(process.env);

export abstract class AppConfig {
    abstract readonly env: string;
    abstract readonly port: number;
    abstract readonly db: {
        readonly url: string;
    };
    abstract readonly redis: {
        readonly port: number;
    };
}

export const configValue: AppConfig = {
    env: parsedEnv.NODE_ENV,
    port: parsedEnv.PORT,
    db: {
        url: parsedEnv.DATABASE_URL,
    },
    redis: {
        port: parsedEnv.REDIS_PORT,
    },
};