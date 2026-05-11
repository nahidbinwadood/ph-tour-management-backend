import bcrypt from 'bcryptjs';
import httpStatusCode from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import envVars from '../../../server';
import AppError from '../../errorHelpers/AppError';
import { IUser, Role } from './user.interface';
import { User } from './user.model';

// get all the users==>
const getAllUsers = async () => {
  const user = await User.find({});
  const updatedResponse = user?.map((user) => {
    const { password, ...rest } = user.toObject();
    return rest;
  });
  return updatedResponse;
};

// delete user==>
const deleteUser = async (id: string, decodedToken: JwtPayload) => {
  // throw error if the id is not provided==>
  if (!id) {
    throw new AppError(httpStatusCode.BAD_GATEWAY, 'Please provide user id');
  }

  //super admin cannot delete a super admin==>
  const selectedUserData = await User.findOne({ _id: id });

  // throw error if super admin wants to delete a super admin==>
  if (
    decodedToken?.role === Role.SUPER_ADMIN &&
    selectedUserData?.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatusCode.UNAUTHORIZED,
      'You are not authorized to delete a super admin'
    );
  }

  // throw error if the admin wants to delete a super admin==>
  if (
    decodedToken.role == Role.ADMIN &&
    selectedUserData?.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatusCode.UNAUTHORIZED,
      "You don't have permission to delete a super admin"
    );
  }

  // throw error if the admin wants to delete a admin==>
  if (
    decodedToken.role === Role.ADMIN &&
    selectedUserData?.role === Role.ADMIN
  ) {
    throw new AppError(
      httpStatusCode.UNAUTHORIZED,
      "You don't have permission to delete a admin"
    );
  }

  const result = await User.findOneAndDelete({ _id: id });

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found');
  }
  return result;
};

// update user==>
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist)
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found');

  // check the role==>
  if (payload.role) {
    // if the user or guide tries to update their role==>
    if (decodedToken.role == Role.USER || decodedToken.role == Role.GUIDE) {
      throw new AppError(
        httpStatusCode.UNAUTHORIZED,
        'You are not authorized to access this'
      );
    }

    // if the admin want to update his role==>
    if (decodedToken.role == Role.ADMIN && payload.role == Role.SUPER_ADMIN) {
      throw new AppError(
        httpStatusCode.UNAUTHORIZED,
        'You are not authorized to access this'
      );
    }
  }

  // check the user status update from USER or GUIDE==>
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken?.role == Role.USER || decodedToken?.role === Role.GUIDE) {
      throw new AppError(
        httpStatusCode.UNAUTHORIZED,
        'You are not authorized to access this'
      );
    }
  }

  // update the password==>
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

export const UserServices = {
  getAllUsers,
  deleteUser,
  updateUser,
};
