import { z } from 'zod';

export const inviteAcceptSchema = z.object({
  creationToken: z.string().uuid(),
  accept: z.boolean(),
});

export type InviteAcceptDto = z.infer<typeof inviteAcceptSchema>;
