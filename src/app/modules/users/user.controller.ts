import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// get all users==>
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'All users data retrieved successfully!',
    data: result,
  });
});

// get all users==>
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'User data retrieved successfully!',
    data: result,
  });
});

// delete user==>
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  await UserServices.deleteUser(req.params.id, decodedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'User deleted successfully',
  });
});

// update user==>
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const decodedToken = req.user;

  const result = await UserServices.updateUser(
    userId,
    payload,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'User updated successfully',
    data: result,
  });
});

// get me data==>
const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const response = await UserServices.getMe(userId);

  console.log({ response });

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'User data fetched successfully',
    data: response,
  });
});

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  getMe,
};
