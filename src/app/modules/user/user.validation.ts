import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    role: z.string().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    password: z.string().optional(),
    role: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
