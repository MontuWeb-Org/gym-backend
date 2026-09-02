import * as dotenv from 'dotenv';

import { z } from 'zod';
import { expand } from 'dotenv-expand';

const myEnv = dotenv.config();
expand(myEnv);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.url(),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_HOST: z.string().optional().default('localhost'),
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
    readonly host: string;
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
    host: parsedEnv.REDIS_HOST,
  },
};
