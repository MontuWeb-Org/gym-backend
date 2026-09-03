import { registerAs } from '@nestjs/config';

export default registerAs('prisma', () => ({
    url: process.env.DATABASE_URL,
}));