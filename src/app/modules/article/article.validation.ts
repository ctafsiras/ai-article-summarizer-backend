import { z } from 'zod';

// Schema for creating a new product
const createArticleSchema = z.object({
  body: z.object({
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateArticleSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const ArticleValidation = {
  createArticleSchema,
  updateArticleSchema,
};
