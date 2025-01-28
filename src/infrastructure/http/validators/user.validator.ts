import {z} from 'zod';

const dateSchema = z.string().transform(str => new Date(str));

export const createUserSchema = z.object({
  username: z.string().min(4).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100).optional(),
  expiresAt: dateSchema,
  status: z.enum(['active', 'inactive', 'expired']).default('active'),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    username: z.string().min(4).max(100).optional(),
    password: z.string().min(6).max(100).optional(),
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    expiresAt: dateSchema.optional(),
    status: z.enum(['active', 'inactive', 'expired']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
