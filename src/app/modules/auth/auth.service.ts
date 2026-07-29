import bcrypt from 'bcryptjs';
import httpStatusCode from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import { createUserTokens, generateNewAccessToken } from '../../utils/jwt';
import { IAuthProvider, IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { envVars } from '../../config/env';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../utils/sendEmail';

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

  const userObject = user.toObject();
  delete userObject.password;

  return {
    ...userObject,
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

  const userObject = isExist.toObject();
  delete userObject.password;

  return {
    ...userObject,
    tokens,
  };
};

// get access token==>
const getNewAccessToken = async (refreshToken: string) => {
  const tokens = await generateNewAccessToken(refreshToken);
  return tokens;
};

// change password==>
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  userId: string
) => {
  // find user==>
  const user = await User.findById(userId);

  // throw error if the user is not exist==>
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found');
  }

  // throw error if user don't have any password set==>
  if (!user.password) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Please set your password first to do this action'
    );
  }
  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  // Throw error if the old password is incorrect==>
  if (!isPasswordMatched) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Old password is incorrect');
  }

  const newPasswordIsSameAsOldPassword = await bcrypt.compare(
    payload.newPassword,
    user.password
  );

  // throw error if the new password is same as old password==>
  if (newPasswordIsSameAsOldPassword) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'New password cannot be same as old password'
    );
  }

  user.password = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user.save();
};

// set password==>
const setPassword = async (payload: { password: string }, userId: string) => {
  const user = await User.findById(userId);

  // throw error if the user not found==>
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found');
  }

  // throw error if the user set password already==>
  if (user.password) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'The password already set.You can change your password'
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user.password = hashedPassword;

  const isGoogleUser = user?.auths?.some(
    (providerObj) => providerObj.provider === 'google'
  );

  // add credentials in the auths if the user is google credentials user==>
  if (isGoogleUser) {
    user.auths = [
      ...(user?.auths as IAuthProvider[]),
      {
        provider: 'credentials',
        providerId: user?.email,
      },
    ];
  }

  await user.save();
};

// forget password==>
const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  // throw error if the user doest not exist==>
  if (!isUserExist) {
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      'User doest exist with this email'
    );
  }

  const isGoogleUser = isUserExist?.auths?.some(
    (providerObj) => providerObj.provider === 'google'
  );

  // throw error if the user is google authenticated and don't set the password yet==>
  if (isGoogleUser && !isUserExist.password) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'You are currently a google authenticated user and you cannot change your password.Try signing using google and you can add password'
    );
  }

  const payload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const temporaryToken = jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: '10m',
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?user=${isUserExist.id}&token=${temporaryToken}`;

  await sendMail({
    subject: 'Forget Password',
    templateName: 'forgetPassword',
    to: isUserExist.email,
    templateValues: {
      name: isUserExist?.name,
      resetUILink,
    },
  });
};

// reset password==>
const resetPassword = async (
  payload: { password: string; id: string },
  decodedToken: JwtPayload
) => {
  const { id, password } = payload;

  // throw error if the id is not same as the token==>
  if (id !== decodedToken.userId) {
    throw new AppError(
      httpStatusCode.UNAUTHORIZED,
      'Invalid Token or user id provided'
    );
  }

  const isExist = await User.findById(decodedToken.userId);

  // throw error if the user is not exist==>
  if (!isExist) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'User doest not exist');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const updateUser = await User.findOneAndUpdate(
    { _id: decodedToken.userId },
    { password: hashedPassword },
    { new: true }
  ).select('-password');

  // throw error if any error occurs while changing the password==>
  if (!updateUser) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Failed to update the password'
    );
  }
};

export const AuthServices = {
  credentialsLogin,
  createUser,
  getNewAccessToken,
  resetPassword,
  setPassword,
  changePassword,
  forgetPassword,
};
