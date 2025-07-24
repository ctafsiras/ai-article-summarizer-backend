import notFound from '../app/middlewares/notFound';
import httpStatus from 'http-status';

describe('notFound middleware', () => {
  it('should respond with 404 and error message', () => {
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    notFound(req, res, next);
    expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'API Not Found !!',
      error: '',
    });
  });
});
