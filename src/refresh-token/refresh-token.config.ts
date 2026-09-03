import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const refreshTokenEnvSchema = z.object({
    refreshExpiresInDays: z
        .number()
        .int()
        .positive()
        .default(7)
        .transform((val) => val),
});

export default registerAs('refreshToken', () => {
    return refreshTokenEnvSchema.parse({
        refreshExpiresInDays: process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    });
});

