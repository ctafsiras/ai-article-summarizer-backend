import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ArticleValidation } from './article.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { ArticleController } from './article.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(ArticleValidation.createArticleSchema),
  ArticleController.addArticle,
);

router.delete(
  '/:articleId',
  auth(USER_ROLE.user),
  ArticleController.deleteArticle,
);

router.patch(
  '/:articleId',
  auth(USER_ROLE.user),
  validateRequest(ArticleValidation.updateArticleSchema),
  ArticleController.updateArticle,
);

router.get(
  '/:articleId',
  auth(USER_ROLE.user),
  ArticleController.getSingleArticle,
);

router.get('/tags', auth(USER_ROLE.user), ArticleController.getArticlesByTags);

router.get('/', auth(USER_ROLE.user), ArticleController.getAllArticles);

router.get(
  '/my-articles',
  auth(USER_ROLE.user),
  ArticleController.getMyAllArticle,
);

router.get(
  '/summerize/:articleId',
  auth(USER_ROLE.user),
  ArticleController.summerizeSingleArticle,
);

export const ArticleRoutes = router;
