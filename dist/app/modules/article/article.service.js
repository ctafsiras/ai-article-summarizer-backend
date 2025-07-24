"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const client = new openai_1.default();
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
const parseArticleFromLink = (articleLink) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(articleLink);
    const response = yield axios_1.default.get(articleLink, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            Connection: 'keep-alive',
        },
        timeout: 10000, // 10 seconds timeout
    });
    // Parse HTML content
    const $ = cheerio.load(response.data);
    // Extract title - try multiple selectors
    let title = $('h1').first().text().trim() ||
        $('title').text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        'Untitled Article';
    // Clean title (remove site name if present)
    title = title.split(' | ')[0].split(' - ')[0].trim();
    // Extract article content - try multiple selectors for different sites
    const contentSelectors = [
        'article',
        '[role="main"]',
        '.post-content',
        '.entry-content',
        '.article-content',
        '.content',
        'main',
        '.post-body',
        '.story-body',
    ];
    let bodyContent = '';
    for (const selector of contentSelectors) {
        const content = $(selector);
        if (content.length > 0) {
            // Remove script, style, nav, header, footer, ads
            content
                .find('script, style, nav, header, footer, .ad, .advertisement, .social-share')
                .remove();
            bodyContent = content.text().trim();
            if (bodyContent.length > 100)
                break; // Use first substantial content found
        }
    }
    // Fallback: get all paragraph text if no content area found
    if (!bodyContent || bodyContent.length < 100) {
        $('script, style, nav, header, footer, .ad, .advertisement').remove();
        bodyContent = $('p')
            .map((_, el) => $(el).text().trim())
            .get()
            .join('\n\n');
    }
    // Clean and normalize body text
    bodyContent = bodyContent
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
        .trim();
    if (!bodyContent || bodyContent.length < 50) {
        throw new Error('Could not extract meaningful content from the article');
    }
    const aiResponse = yield client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `You are an expert content analyzer. Analyze the given article and return a JSON response with:
          1. "cleanBody": Clean, well-formatted version of the article body (remove any remaining navigation text, ads, etc.)
          2. "tags": Array of 3-7 relevant tags/keywords for the article
          
          Return only valid JSON in this format:
          {
            "cleanBody": "cleaned article content here...",
            "tags": ["tag1", "tag2", "tag3"]
          }`,
            },
            {
                role: 'user',
                content: `Article Title: ${title}\n\nArticle Content: ${bodyContent.substring(0, 4000)}`, // Limit content to avoid token limits
            },
        ],
        temperature: 0.3,
    });
    const aiResult = JSON.parse(aiResponse.choices[0].message.content || '{}');
    return {
        title,
        body: aiResult.cleanBody || bodyContent,
        tags: aiResult.tags || [],
    };
});
exports.ArticleService = {
    addArticleToDB,
    deleteArticleFromDB,
    updateArticleInDB,
    getSingleArticleFromDB,
    getAllArticlesFromDB,
    summerizeSingleArticle,
    getMyAllArticleFromDB,
    parseArticleFromLink,
};
