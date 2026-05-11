import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import envVars from '../../server';
import { IsActive, IUser } from '../modules/users/user.interface';
import { User } from '../modules/users/user.model';
import AppError from '../errorHelpers/AppError';
import httpStatusCode from 'http-status-codes';

// create user token==>
export const createUserTokens = (data: Partial<IUser>) => {
  const payload = {
    userId: data.id,
    email: data.email,
    role: data.role,
  };

  const accessToken = jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES,
  } as SignOptions);

  const refreshToken = jwt.sign(payload, envVars.JWT_REFRESH_SECRET, {
    expiresIn: envVars.JWT_REFRESH_EXPIRES,
  } as SignOptions);

  return {
    accessToken,
    refreshToken,
  };
};

// verify token==>
export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

// generate new access token==>
export const generateNewAccessToken = async (refreshToken: string) => {
  const decodedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);

  const userData = await User.findOne({ _id: decodedToken.userId });

  if (!userData) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'User not found');
  }

  // throw error if the user is not active==>
  if (userData?.isActive !== IsActive.ACTIVE) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `User is ${userData?.isActive}`
    );
  }

  // throw error if the user is deleted==>
  if (userData?.isDeleted) {
    throw new AppError(
      httpStatusCode.UNAUTHORIZED,
      `You don't have permission to do this action`
    );
  }

  const tokens = createUserTokens(userData);

  return tokens;
};
