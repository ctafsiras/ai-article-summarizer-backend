"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sum_1 = require("../utils/sum");
describe('sum utility', () => {
    it('should add two numbers', () => {
        expect((0, sum_1.sum)(2, 3)).toBe(5);
    });
});
