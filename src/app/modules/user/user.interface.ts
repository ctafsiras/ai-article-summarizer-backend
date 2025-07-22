/* eslint-disable no-unused-vars */
import { USER_ROLE } from './user.constant';

export type TUser = {
  id?: number;
  name?: string;
  email: string;
  password: string;
  role?: TUserRole;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserRole = keyof typeof USER_ROLE;
