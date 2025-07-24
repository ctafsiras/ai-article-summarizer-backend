import validateRequest from '../app/middlewares/validateRequest';
import { z } from 'zod';

describe('validateRequest middleware', () => {
  it('should call next for valid input', (done) => {
    const schema = z.object({ body: z.object({ foo: z.string() }) });
    const req = { body: { foo: 'bar' }, cookies: {} } as any;
    const res = {} as any;
    const next = (...args: any[]) => {
      try {
        expect(args.length).toBe(0);
        done();
      } catch (err) {
        done(err);
      }
    };
    const middleware = validateRequest(schema);
    middleware(req, res, next);
  });

  it('should call next with error for invalid input', (done) => {
    const schema = z.object({ body: z.object({ foo: z.string() }) });
    const req = { body: { foo: 123 }, cookies: {} } as any;
    const res = {} as any;
    const next = (...args: any[]) => {
      try {
        expect(args.length).toBe(1);
        expect(args[0]).toBeInstanceOf(Error);
        done();
      } catch (err) {
        done(err);
      }
    };
    const middleware = validateRequest(schema);
    middleware(req, res, next);
  });
});
