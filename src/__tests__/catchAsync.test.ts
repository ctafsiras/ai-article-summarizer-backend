import catchAsync from '../app/utils/catchAsync';

describe('catchAsync utility', () => {
  it('should call next with error if async function throws', async () => {
    const error = new Error('Test error');
    const req = {} as any;
    const res = {} as any;
    const next = jest.fn();
    const asyncFn = jest.fn().mockRejectedValue(error);
    const wrapped = catchAsync(asyncFn);
    await wrapped(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call async function with req, res, next', async () => {
    const req = { foo: 1 } as any;
    const res = { bar: 2 } as any;
    const next = jest.fn();
    const asyncFn = jest.fn().mockResolvedValue(undefined);
    const wrapped = catchAsync(asyncFn);
    await wrapped(req, res, next);
    expect(asyncFn).toHaveBeenCalledWith(req, res, next);
  });
});
