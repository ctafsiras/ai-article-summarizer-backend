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
exports.ArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const article_service_1 = require("./article.service");
const addArticle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    const result = yield article_service_1.ArticleService.addArticleToDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article added successfully!',
        data: result,
    });
}));
const deleteArticle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = req.params.articleId;
    const result = yield article_service_1.ArticleService.deleteArticleFromDB(Number(articleId));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article deleted successfully!',
        data: result,
    });
}));
const updateArticle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = req.params.articleId;
    const payload = req.body;
    const result = yield article_service_1.ArticleService.updateArticleInDB(Number(articleId), payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article updated successfully!',
        data: result,
    });
}));
const getSingleArticle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = req.params.articleId;
    const result = yield article_service_1.ArticleService.getSingleArticleFromDB(Number(articleId));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article retrieved successfully!',
        data: result,
    });
}));
const getMyAllArticle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield article_service_1.ArticleService.getMyAllArticleFromDB(Number(userId), req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Articles retrieved successfully!',
        data: result,
    });
}));
const getAllArticles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield article_service_1.ArticleService.getAllArticlesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'All articles retrieved successfully!',
        data: result,
    });
}));
const summerizeSingleArticle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = req.params.articleId;
    const result = yield article_service_1.ArticleService.summerizeSingleArticle(Number(articleId));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article summerized successfully!',
        data: result,
    });
}));
const askArticleAI = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = req.params.articleId;
    const messages = req.body.messages;
    const result = yield article_service_1.ArticleService.askArticleAI(Number(articleId), messages);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article answered successfully!',
        data: result,
    });
}));
const parseArticleFromLink = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleLink = req.body.articleLink;
    const result = yield article_service_1.ArticleService.parseArticleFromLink(articleLink);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Article parsed successfully!',
        data: result,
    });
}));
exports.ArticleController = {
    addArticle,
    deleteArticle,
    updateArticle,
    getSingleArticle,
    getAllArticles,
    getMyAllArticle,
    summerizeSingleArticle,
    askArticleAI,
    parseArticleFromLink,
};
