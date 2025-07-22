import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from './auth.utils';
import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  //checking if the password is correct

  if (!(await bcrypt.compare(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not matched');

  //create token and sent to the  client

  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user.id,
  };
  // console.log(jwtPayload);
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUser,
};
