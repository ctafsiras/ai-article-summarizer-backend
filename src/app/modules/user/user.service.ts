import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import { prisma } from '../../utils/prisma';

const createUserIntoDB = async (payload: TUser) => {
  const result = await prisma.user.create({
    data: payload,
  });
  return result;
};

const updateUserInDB = async (
  user: (JwtPayload & { role: string }) | undefined,
  payload: Partial<TUser>,
) => {
  const result = await prisma.user.update({
    where: { id: user?.id },
    data: payload,
  });
  return result;
};

const getMeFromDB = async (id: number) => {
  const result = await prisma.user.findUnique({ where: { id } });
  return result;
};

const deleteUserFromDB = async (
  user: (JwtPayload & { role: string }) | undefined,
  id: number,
) => {
  const result = await prisma.user.delete({ where: { id } });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  updateUserInDB,
  getMeFromDB,
  deleteUserFromDB,
};
