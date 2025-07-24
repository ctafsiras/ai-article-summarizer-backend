"use strict";
/* eslint-disable no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
const allowedOrigins = [
    'http://localhost:3000',
    'https://article-summarizer.ctafsiras.com',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// application routes
app.use('/api/v1', routes_1.default);
const test = (req, res) => {
    res.send({ message: 'Go where you from!' });
};
app.get('/', test);
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
