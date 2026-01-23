import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { UserServices } from './user.service';
import { catchAsync } from '../../utis/catchAsync';
import sendResponse from '../../utis/sendResponse';

// create user ==>
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    // response==>
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
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
      statusCode: httpStatus.OK,
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
      statusCode: httpStatus.OK,
      success: true,
      message: 'You have logged in successfully',
      data: response,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  loginUser,
};
