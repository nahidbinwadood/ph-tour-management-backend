import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { UserServices } from './user.service';
import { catchAsync } from '../../utis/catchAsync';

// create user ==>
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'User created successfully !',
      user,
    });
  }
);

// get all users==>
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();
    res.status(httpStatus.OK).json({
      success: true,
      message: 'All users data retrieved successfully!',
      users,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
};
