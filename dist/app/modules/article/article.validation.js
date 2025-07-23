"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleValidation = void 0;
const zod_1 = require("zod");
// Schema for creating a new product
const createArticleSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        body: zod_1.z.string(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateArticleSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        body: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.ArticleValidation = {
    createArticleSchema,
    updateArticleSchema,
};
