import AppError from '../../errorHelpers/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { envVars } from '../../config/env';
import jwt from 'jsonwebtoken';

// create user==>
const createUser = async (payload: Partial<IUser>) => {
  payload.password = await bcrypt.hash(payload.password as string, 10);
  const user = await User.create(payload);
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

export const UserServices = {
  createUser,
  getAllUsers,
  loginUser,
};
