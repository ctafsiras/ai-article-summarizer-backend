import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TArticle } from './article.interface';
import { prisma } from '../../utils/prisma';
import OpenAI from 'openai';
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

  const client = new OpenAI();
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

export const ArticleService = {
  addArticleToDB,
  deleteArticleFromDB,
  updateArticleInDB,
  getSingleArticleFromDB,
  getAllArticlesFromDB,
  summerizeSingleArticle,
  getMyAllArticleFromDB,
};
