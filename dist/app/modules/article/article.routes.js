"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const article_validation_1 = require("./article.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const article_controller_1 = require("./article.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(article_validation_1.ArticleValidation.createArticleSchema), article_controller_1.ArticleController.addArticle);
router.delete('/:articleId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), article_controller_1.ArticleController.deleteArticle);
router.patch('/:articleId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(article_validation_1.ArticleValidation.updateArticleSchema), article_controller_1.ArticleController.updateArticle);
router.get('/', article_controller_1.ArticleController.getAllArticles);
router.get('/my-articles', (0, auth_1.default)(user_constant_1.USER_ROLE.user), article_controller_1.ArticleController.getMyAllArticle);
router.get('/:articleId', article_controller_1.ArticleController.getSingleArticle);
router.get('/summarize/:articleId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), article_controller_1.ArticleController.summerizeSingleArticle);
router.post('/ask/:articleId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(article_validation_1.ArticleValidation.askArticleAISchema), article_controller_1.ArticleController.askArticleAI);
router.post('/parse-from-link', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(article_validation_1.ArticleValidation.parseArticleFromLinkSchema), article_controller_1.ArticleController.parseArticleFromLink);
exports.ArticleRoutes = router;
