import { sum } from '../utils/sum';

describe('sum utility', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
