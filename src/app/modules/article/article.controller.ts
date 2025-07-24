import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ArticleService } from './article.service';
import { CustomRequest } from '../../middlewares/auth';

const addArticle = catchAsync(async (req: CustomRequest, res) => {
  const payload = { ...req.body, userId: req.user?.id };
  const result = await ArticleService.addArticleToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article added successfully!',
    data: result,
  });
});

const deleteArticle = catchAsync(async (req: CustomRequest, res) => {
  const articleId = req.params.articleId;
  const result = await ArticleService.deleteArticleFromDB(Number(articleId));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article deleted successfully!',
    data: result,
  });
});

const updateArticle = catchAsync(async (req: CustomRequest, res) => {
  const articleId = req.params.articleId;
  const payload = req.body;
  const result = await ArticleService.updateArticleInDB(
    Number(articleId),
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article updated successfully!',
    data: result,
  });
});

const getSingleArticle = catchAsync(async (req: CustomRequest, res) => {
  const articleId = req.params.articleId;
  const result = await ArticleService.getSingleArticleFromDB(Number(articleId));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article retrieved successfully!',
    data: result,
  });
});

const getMyAllArticle = catchAsync(async (req: CustomRequest, res) => {
  const userId = req.user?.id;
  const result = await ArticleService.getMyAllArticleFromDB(
    Number(userId),
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Articles retrieved successfully!',
    data: result,
  });
});

const getAllArticles = catchAsync(async (req, res) => {
  const result = await ArticleService.getAllArticlesFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All articles retrieved successfully!',
    data: result,
  });
});

const summerizeSingleArticle = catchAsync(async (req: CustomRequest, res) => {
  const articleId = req.params.articleId;
  const result = await ArticleService.summerizeSingleArticle(Number(articleId));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article summerized successfully!',
    data: result,
  });
});

const parseArticleFromLink = catchAsync(async (req: CustomRequest, res) => {
  const articleLink = req.body.articleLink;
  const result = await ArticleService.parseArticleFromLink(articleLink);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Article parsed successfully!',
    data: result,
  });
});

export const ArticleController = {
  addArticle,
  deleteArticle,
  updateArticle,
  getSingleArticle,
  getAllArticles,
  getMyAllArticle,
  summerizeSingleArticle,
  parseArticleFromLink,
};
