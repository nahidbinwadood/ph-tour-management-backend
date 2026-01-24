import AppError from '../../errorHelpers/AppError';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import httpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { envVars } from '../../config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

// create user==>
const createUser = async (payload: Partial<IUser>) => {
  const isExist = await User.findOne({ email: payload.email });

  // check if the user already exists ===>
  if (isExist)
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'User already exists with this email'
    );

  // hash the password==>
  payload.password = await bcrypt.hash(payload.password as string, 10);

  // set the auths==>
  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: payload.email as string,
  };

  // create user==>
  const user = await User.create({ ...payload, auths: [authProvider] });
  return user;
};

// get all the users==>
const getAllUsers = async () => {
  const user = await User.find({});
  return user;
};

// login ==>
const loginUser = async (payload: Partial<IUser>) => {
  const isExist = await User.findOne({ email: payload.email });

  if (!isExist)
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      'No user found with this email'
    );

  const passwordMatch = await bcrypt.compare(
    payload.password as string,
    isExist.password as string
  );

  if (!passwordMatch)
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      'The email or password doesn’t seem right. Please double-check and try again 🔁'
    );

  const jwtPayload = {
    userId: isExist?.id,
    email: isExist?.email,
    role: isExist?.role,
  };

  const JWT_SECRET = envVars.JWT_SECRET;

  const accessToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' });

  return {
    accessToken,
  };
};

// delete user==>
const deleteUser = async (id: string) => {
  if (!id)
    throw new AppError(httpStatusCode.BAD_GATEWAY, 'Please provide user id');

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
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  loginUser,
  deleteUser,
  updateUser,
};
