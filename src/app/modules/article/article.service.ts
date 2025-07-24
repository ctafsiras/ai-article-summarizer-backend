import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ParsedArticle, TArticle } from './article.interface';
import { prisma } from '../../utils/prisma';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new OpenAI();

const addArticleToDB = async (payload: TArticle) => {
  const result = await prisma.article.create({ data: payload });
  return result;
};

const deleteArticleFromDB = async (articleId: number) => {
  const articleData = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!articleData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article does not exist!');
  }
  const result = await prisma.article.delete({ where: { id: articleId } });
  return result;
};

const updateArticleInDB = async (
  articleId: number,
  articleNewData: Partial<TArticle>,
) => {
  const articleData = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!articleData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article does not exist!');
  }
  const result = await prisma.article.update({
    where: { id: articleId },
    data: articleNewData,
  });
  return result;
};

const getSingleArticleFromDB = async (articleId: number) => {
  const articleData = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!articleData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article does not exist!');
  }
  return articleData;
};

const getMyAllArticleFromDB = async (
  userId: number,
  query: Record<string, unknown>,
) => {
  const { searchTerm = '', tags = '' } = query;
  const tagsArray =
    typeof tags === 'string' && tags.length > 0 ? tags.split(',') : [];
  const searchableFields = ['title', 'body'];

  const articleData = await prisma.article.findMany({
    where: {
      userId: userId,
      ...(searchTerm
        ? {
            OR: searchableFields.map((field) => ({
              [field]: { contains: searchTerm, mode: 'insensitive' },
            })),
          }
        : {}),
      ...(tagsArray.length > 0 ? { tags: { hasSome: tagsArray } } : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (!articleData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article does not exist!');
  }
  return articleData;
};

const getAllArticlesFromDB = async (query: Record<string, unknown>) => {
  const {
    searchTerm = '',
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'asc',
    tags = '',
  } = query;

  const tagsArray =
    typeof tags === 'string' && tags.length > 0 ? tags.split(',') : [];
  const skip = (Number(page) - 1) * Number(limit);
  const searchableFields = ['title', 'body'];
  const searchQuery = prisma.article.findMany({
    where: {
      OR: searchableFields.map((field) => ({
        [field]: { contains: searchTerm },
      })),
      ...(tagsArray.length > 0 ? { tags: { hasSome: tagsArray } } : {}),
    },
    orderBy: {
      [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
    },
    skip,
    take: parseInt(limit as string),
  });

  const result = await searchQuery;
  return result;
};

const summerizeSingleArticle = async (articleId: number) => {
  const articleData = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!articleData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article does not exist!');
  }
  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'system',
        content:
          'You are an expert in article summerizing. Please summerize the user content article in 50 words.',
      },
      {
        role: 'user',
        content: `Article Title: ${articleData.title}. Article Body: ${articleData.body}`,
      },
    ],
  });
  return { result: response.output_text };
};

const parseArticleFromLink = async (
  articleLink: string,
): Promise<ParsedArticle> => {
  const url = new URL(articleLink);

  const response = await axios.get(articleLink, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      Connection: 'keep-alive',
    },
    timeout: 10000, // 10 seconds timeout
  });

  // Parse HTML content
  const $ = cheerio.load(response.data);

  // Extract title - try multiple selectors
  let title =
    $('h1').first().text().trim() ||
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
        .find(
          'script, style, nav, header, footer, .ad, .advertisement, .social-share',
        )
        .remove();
      bodyContent = content.text().trim();
      if (bodyContent.length > 100) break; // Use first substantial content found
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

  const aiResponse = await client.chat.completions.create({
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
};

export const ArticleService = {
  addArticleToDB,
  deleteArticleFromDB,
  updateArticleInDB,
  getSingleArticleFromDB,
  getAllArticlesFromDB,
  summerizeSingleArticle,
  getMyAllArticleFromDB,
  parseArticleFromLink,
};
