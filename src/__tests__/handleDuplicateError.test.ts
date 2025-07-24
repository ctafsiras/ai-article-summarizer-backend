import handleDuplicateError from '../app/errors/handleDuplicateError';

describe('handleDuplicateError', () => {
  it('should extract duplicate value from error message', () => {
    const error = { message: 'Key "email@example.com" already exists.' };
    const result = handleDuplicateError(error);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Invalid ID');
    expect(result.errorSources[0].message).toBe(
      'email@example.com is already exists',
    );
  });
});
