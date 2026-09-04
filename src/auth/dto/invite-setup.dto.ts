import { z } from 'zod';

export const inviteSetupSchema = z
  .object({
    creationToken: z.string().uuid(),
    name: z.string().min(2).max(100),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type InviteSetupDto = z.infer<typeof inviteSetupSchema>;
