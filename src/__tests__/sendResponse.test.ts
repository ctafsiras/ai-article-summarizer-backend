import sendResponse from '../app/utils/sendResponse';

describe('sendResponse utility', () => {
  it('should send correct response structure and status', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const data = {
      statusCode: 200,
      success: true,
      message: 'Success',
      data: { foo: 'bar' },
    };
    sendResponse(res, data);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success',
      data: { foo: 'bar' },
    });
  });
});
