import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { expand } from 'dotenv-expand';

const myEnv = dotenv.config();
expand(myEnv);

const prismaEnvSchema = z.object({
    url: z.url(),
});
export default registerAs('prisma', () => {
    return prismaEnvSchema.parse({ url: process.env.DATABASE_URL });
});