import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// create user ==>
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    // response==>
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.CREATED,
      message: 'User created successfully',
      data: user,
    });
  }
);

// get all users==>
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'All users data retrieved successfully!',
      data: result,
    });
  }
);

// login ==>
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await UserServices.loginUser(req.body);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'You have logged in successfully',
      data: response,
    });
  }
);

// delete user==>
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.deleteUser(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'User deleted successfully',
      data: [],
    });
  }
);

// update user==>
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const decodedToken = req.user;

    const result = await UserServices.updateUser(userId, payload, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'User updated successfully',
      data: result,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  loginUser,
  deleteUser,
  updateUser,
};
