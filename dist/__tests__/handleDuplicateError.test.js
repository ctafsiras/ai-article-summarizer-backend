"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError_1 = __importDefault(require("../app/errors/handleDuplicateError"));
describe('handleDuplicateError', () => {
    it('should extract duplicate value from error message', () => {
        const error = { message: 'Key "email@example.com" already exists.' };
        const result = (0, handleDuplicateError_1.default)(error);
        expect(result.statusCode).toBe(400);
        expect(result.message).toBe('Invalid ID');
        expect(result.errorSources[0].message).toBe('email@example.com is already exists');
    });
});
