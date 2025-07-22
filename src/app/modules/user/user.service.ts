import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import { prisma } from '../../utils/prisma';
import config from '../../config';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUserIntoDB = async (payload: TUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }
  const password = payload.password;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const updateUserInDB = async (
  user: (JwtPayload & { role: string }) | undefined,
  payload: Partial<TUser>,
) => {
  const result = await prisma.user.update({
    where: { id: user?.id },
    data: payload,
  });
  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const getMeFromDB = async (id: number) => {
  const result = await prisma.user.findUnique({ where: { id } });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
  }
  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const deleteUserFromDB = async (
  user: (JwtPayload & { role: string }) | undefined,
  id: number,
) => {
  const result = await prisma.user.delete({ where: { id } });
  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

export const UserServices = {
  createUserIntoDB,
  updateUserInDB,
  getMeFromDB,
  deleteUserFromDB,
};
