import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    email: string;
    role: string;
    id: number;
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: Number(expiresIn),
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
