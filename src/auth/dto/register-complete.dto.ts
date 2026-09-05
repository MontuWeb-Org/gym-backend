import { z } from 'zod';

export const registerCompleteSchema = z.object({
  otp: z.string().length(6),
  creationToken: z.string().uuid(),
});

export type RegisterCompleteDto = z.infer<typeof registerCompleteSchema>;
