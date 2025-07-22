import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    role: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    profilePicture: z.string().optional(),
  })
});

const updateUserValidationSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profilePicture: z.string().optional(),
  })
});

const updateUserAccessSchema = z.object({
  body: z.object({
    role: z.enum(['manager', 'moderator']).optional(),
    isBlocked: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  })
})

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateUserAccessSchema,
};