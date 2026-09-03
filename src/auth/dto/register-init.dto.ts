import { z } from 'zod';

export const registerInitSchema = z
  .object({
    name: z.string().min(2).max(100),
    phoneNumber: z.string().min(7).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInitDto = z.infer<typeof registerInitSchema>;
