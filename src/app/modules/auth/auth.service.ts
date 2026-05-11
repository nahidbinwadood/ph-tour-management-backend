import AppError from '../../errorHelpers/AppError';
import { IAuthProvider, IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import httpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';
import {
  createUserTokens,
  generateNewAccessToken,
  verifyToken,
} from '../../utils/jwt';
import envVars from '../../../server';

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
  payload.password = await bcrypt.hash(
    payload.password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // set the auths==>
  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: payload.email as string,
  };

  // create user==>
  const user = await User.create({ ...payload, auths: [authProvider] });

  const { password, ...rest } = user.toObject();
  return {
    ...rest,
  };
};

// credentials login==>
const credentialsLogin = async (payload: Partial<IUser>) => {
  const isExist = await User.findOne({ email: payload.email });

  // throw error if the email doesn't exist==>
  if (!isExist) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'User not found with this email'
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password as string,
    isExist.password as string
  );

  //throw error if the password doest not match==>
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'The email or password is not correct'
    );
  }

  const tokens = createUserTokens(isExist);

  const { password, ...rest } = isExist.toObject();

  return {
    ...rest,
    tokens,
  };
};

// get access token==>
const getNewAccessToken = async (refreshToken: string) => {
  const tokens = generateNewAccessToken(refreshToken);
  return tokens;
};

export const AuthServices = {
  credentialsLogin,
  createUser,
  getNewAccessToken,
};
