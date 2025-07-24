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
const catchAsync_1 = __importDefault(require("../app/utils/catchAsync"));
describe('catchAsync utility', () => {
    it('should call next with error if async function throws', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Test error');
        const req = {};
        const res = {};
        const next = jest.fn();
        const asyncFn = jest.fn().mockRejectedValue(error);
        const wrapped = (0, catchAsync_1.default)(asyncFn);
        yield wrapped(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    }));
    it('should call async function with req, res, next', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { foo: 1 };
        const res = { bar: 2 };
        const next = jest.fn();
        const asyncFn = jest.fn().mockResolvedValue(undefined);
        const wrapped = (0, catchAsync_1.default)(asyncFn);
        yield wrapped(req, res, next);
        expect(asyncFn).toHaveBeenCalledWith(req, res, next);
    }));
});
