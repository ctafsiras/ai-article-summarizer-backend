import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { UserServices } from './user.service';
import { CustomRequest } from '../../middlewares/auth';

const createUser = catchAsync(async (req: CustomRequest, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const getMe = catchAsync(async (req: CustomRequest, res) => {
  const result = await UserServices.getMeFromDB(req?.user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your data retrieved successfully!',
    data: result,
  });
});

const updateUser = catchAsync(async (req: CustomRequest, res) => {
  const user = req?.user;
  const result = await UserServices.updateUserInDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: CustomRequest, res) => {
  const user = req?.user;
  const id = req.params.id;
  const result = await UserServices.deleteUserFromDB(user, Number(id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getMe,
  updateUser,
  deleteUser,
};
