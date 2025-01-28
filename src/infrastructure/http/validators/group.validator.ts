import {z} from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
});
