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

router.get('/', ArticleController.getAllArticles);

router.get(
  '/my-articles',
  auth(USER_ROLE.user),
  ArticleController.getMyAllArticle,
);

router.get('/:articleId', ArticleController.getSingleArticle);

router.get('/summarize/:articleId', ArticleController.summerizeSingleArticle);

router.post(
  '/parse-from-link',
  auth(USER_ROLE.user),
  validateRequest(ArticleValidation.parseArticleFromLinkSchema),
  ArticleController.parseArticleFromLink,
);

export const ArticleRoutes = router;
