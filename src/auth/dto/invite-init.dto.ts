import { z } from 'zod';

export const inviteInitSchema = z.object({
  email: z.string().email(),
});

export type InviteInitDto = z.infer<typeof inviteInitSchema>;
