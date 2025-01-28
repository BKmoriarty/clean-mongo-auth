import {z} from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(2).max(100),
  level: z.number().int().min(1).max(100).optional(),
  description: z.string().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  level: z.number().int().min(1).max(100).optional(),
  description: z.string().optional(),
});
