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

const parseArticleFromLinkSchema = z.object({
  body: z.object({
    articleLink: z.string().url(),
  }),
});

const askArticleAISchema = z.object({
  body: z.object({
    messages: z.array(z.object({ role: z.string(), content: z.string() })),
  }),
});

export const ArticleValidation = {
  createArticleSchema,
  updateArticleSchema,
  parseArticleFromLinkSchema,
  askArticleAISchema,
};
