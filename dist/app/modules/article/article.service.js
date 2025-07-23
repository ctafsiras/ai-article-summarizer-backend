"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../utils/prisma");
const openai_1 = __importDefault(require("openai"));
const addArticleToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.article.create({ data: payload });
    return result;
});
const deleteArticleFromDB = (articleId) => __awaiter(void 0, void 0, void 0, function* () {
    const articleData = yield prisma_1.prisma.article.findUnique({
        where: { id: articleId },
    });
    if (!articleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Article does not exist!');
    }
    const result = yield prisma_1.prisma.article.delete({ where: { id: articleId } });
    return result;
});
const updateArticleInDB = (articleId, articleNewData) => __awaiter(void 0, void 0, void 0, function* () {
    const articleData = yield prisma_1.prisma.article.findUnique({
        where: { id: articleId },
    });
    if (!articleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Article does not exist!');
    }
    const result = yield prisma_1.prisma.article.update({
        where: { id: articleId },
        data: articleNewData,
    });
    return result;
});
const getSingleArticleFromDB = (articleId) => __awaiter(void 0, void 0, void 0, function* () {
    const articleData = yield prisma_1.prisma.article.findUnique({
        where: { id: articleId },
    });
    if (!articleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Article does not exist!');
    }
    return articleData;
});
const getMyAllArticleFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm = '', tags = '' } = query;
    const tagsArray = typeof tags === 'string' && tags.length > 0 ? tags.split(',') : [];
    const searchableFields = ['title', 'body'];
    const articleData = yield prisma_1.prisma.article.findMany({
        where: Object.assign(Object.assign({ userId: userId }, (searchTerm
            ? {
                OR: searchableFields.map((field) => ({
                    [field]: { contains: searchTerm, mode: 'insensitive' },
                })),
            }
            : {})), (tagsArray.length > 0 ? { tags: { hasSome: tagsArray } } : {})),
    });
    if (!articleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Article does not exist!');
    }
    return articleData;
});
const getAllArticlesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm = '', page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'asc', tags = '', } = query;
    const tagsArray = typeof tags === 'string' && tags.length > 0 ? tags.split(',') : [];
    const skip = (Number(page) - 1) * Number(limit);
    const searchableFields = ['title', 'body'];
    const searchQuery = prisma_1.prisma.article.findMany({
        where: Object.assign({ OR: searchableFields.map((field) => ({
                [field]: { contains: searchTerm },
            })) }, (tagsArray.length > 0 ? { tags: { hasSome: tagsArray } } : {})),
        orderBy: {
            [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        skip,
        take: parseInt(limit),
    });
    const result = yield searchQuery;
    return result;
});
const summerizeSingleArticle = (articleId) => __awaiter(void 0, void 0, void 0, function* () {
    const articleData = yield prisma_1.prisma.article.findUnique({
        where: { id: articleId },
    });
    if (!articleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Article does not exist!');
    }
    const client = new openai_1.default();
    const response = yield client.responses.create({
        model: 'gpt-4o-mini',
        input: [
            {
                role: 'system',
                content: 'You are an expert in article summerizing. Please summerize the user content article in 50 words.',
            },
            {
                role: 'user',
                content: `Article Title: ${articleData.title}. Article Body: ${articleData.body}`,
            },
        ],
    });
    return { result: response.output_text };
});
exports.ArticleService = {
    addArticleToDB,
    deleteArticleFromDB,
    updateArticleInDB,
    getSingleArticleFromDB,
    getAllArticlesFromDB,
    summerizeSingleArticle,
    getMyAllArticleFromDB,
};
