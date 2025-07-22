import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidation.createUserValidationSchema),
  auth(USER_ROLE.user),
  UserControllers.createUser,
);

router.get('/me', auth(USER_ROLE.user), UserControllers.getMe);

router.patch(
  '/update-me',
  validateRequest(UserValidation.updateUserValidationSchema),
  auth(USER_ROLE.user),
  UserControllers.updateUser,
);

router.delete('/:id', auth(USER_ROLE.user), UserControllers.deleteUser);

export const UserRoutes = router;
