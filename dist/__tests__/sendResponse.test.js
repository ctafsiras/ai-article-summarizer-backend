"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse_1 = __importDefault(require("../app/utils/sendResponse"));
describe('sendResponse utility', () => {
    it('should send correct response structure and status', () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const data = {
            statusCode: 200,
            success: true,
            message: 'Success',
            data: { foo: 'bar' },
        };
        (0, sendResponse_1.default)(res, data);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Success',
            data: { foo: 'bar' },
        });
    });
});
