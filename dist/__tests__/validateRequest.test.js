"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest_1 = __importDefault(require("../app/middlewares/validateRequest"));
const zod_1 = require("zod");
describe('validateRequest middleware', () => {
    it('should call next for valid input', (done) => {
        const schema = zod_1.z.object({ body: zod_1.z.object({ foo: zod_1.z.string() }) });
        const req = { body: { foo: 'bar' }, cookies: {} };
        const res = {};
        const next = (...args) => {
            try {
                expect(args.length).toBe(0);
                done();
            }
            catch (err) {
                done(err);
            }
        };
        const middleware = (0, validateRequest_1.default)(schema);
        middleware(req, res, next);
    });
    it('should call next with error for invalid input', (done) => {
        const schema = zod_1.z.object({ body: zod_1.z.object({ foo: zod_1.z.string() }) });
        const req = { body: { foo: 123 }, cookies: {} };
        const res = {};
        const next = (...args) => {
            try {
                expect(args.length).toBe(1);
                expect(args[0]).toBeInstanceOf(Error);
                done();
            }
            catch (err) {
                done(err);
            }
        };
        const middleware = (0, validateRequest_1.default)(schema);
        middleware(req, res, next);
    });
});
