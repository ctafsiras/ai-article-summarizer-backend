"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../app/middlewares/notFound"));
const http_status_1 = __importDefault(require("http-status"));
describe('notFound middleware', () => {
    it('should respond with 404 and error message', () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        (0, notFound_1.default)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(http_status_1.default.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'API Not Found !!',
            error: '',
        });
    });
});
