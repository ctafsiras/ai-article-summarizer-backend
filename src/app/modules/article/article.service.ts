import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TArticle } from './article.interface';
import { prisma } from '../../utils/prisma';
import OpenAI from 'openai';
const addArticleToDB = async (payload: TArticle) => {
  const articleData = { ...payload };
  const result = await prisma.article.create({ data: articleData });
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

const getMyAllArticleFromDB = async (userId: number) => {
  const articleData = await prisma.article.findMany({
    where: { userId: userId },
  });
  if (!articleData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article does not exist!');
  }
  return articleData;
};

const getArticlesByTagsFromDB = async (tags: string[]) => {
  const result = await prisma.article.findMany({
    where: { tags: { hasSome: tags } },
  });
  return result;
};

const getAllArticlesFromDB = async (query: Record<string, unknown>) => {
  const {
    searchTerm = '',
    page = 1,
    limit = 20,
    sortBy,
    sortOrder = 'asc',
  } = query;

  const filter: Record<string, unknown> = {};

  if (query.tags) {
    filter.tags = { hasSome: query.tags };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const searchableFields = ['title', 'body'];
  const searchQuery = prisma.article.findMany({
    where: {
      OR: searchableFields.map((field) => ({
        [field]: { contains: searchTerm },
      })),
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
    model: 'gpt-4.1',
    input: articleData.body,
  });
  return { result: response.output_text };
};

export const ArticleService = {
  addArticleToDB,
  deleteArticleFromDB,
  updateArticleInDB,
  getSingleArticleFromDB,
  getArticlesByTagsFromDB,
  getAllArticlesFromDB,
  summerizeSingleArticle,
  getMyAllArticleFromDB,
};
