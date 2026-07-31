/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { removeCookie, setAuthCookie } from '../../utils/cookie';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { createUserTokens } from '../../utils/jwt';
import { envVars } from '../../config/env';
import passport from 'passport';
import { HttpStatusCode } from 'axios';

// create user==>
const createUser = catchAsync(async (req: Request, res: Response) => {
  const response = await AuthServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: 'An OTP has been sent to your email',
    data: response,
  });
});

// verify otp==>
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { otp, token } = req.body;

  const response = await AuthServices.verifyOtp(otp, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'OTP verification successful',
    data: response,
  });
});

// resend otp==>
const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  const response = await AuthServices.resendOtp(token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'A new OTP has been send to your email.',
    data: response,
  });
});

// credentials login==>
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      // if error then show the error==>
      if (err) {
        return next(new AppError(httpStatusCode.UNAUTHORIZED, err));
      }

      // show error if the
      if (!user) {
        return next(new AppError(httpStatusCode.UNAUTHORIZED, info?.message));
      }

      const userTokens = createUserTokens(user);

      const userObj = user.toObject();
      delete userObj.password;

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: 'User Logged In Successfully',
        data: {
          tokens: {
            ...userTokens,
          },
          user: userObj,
        },
      });
    })(req, res, next);
  }
);

// get new access token==>
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'No refresh token found from cookies'
    );
  }

  const response = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookie(res, response);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'New Access Token Retrieved Successfully',
    data: response,
  });
});

// logout ==>
const logout = catchAsync(async (req: Request, res: Response) => {
  removeCookie(res, ['accessToken', 'refreshToken']);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'You have been logged out successfully',
  });
});

// change password==>
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;

  const response = await AuthServices.changePassword(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'Password changed successfully',
    data: response,
  });
});

// set password==>
const setPassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const response = await AuthServices.setPassword(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatusCode.Ok,
    message: 'Password set successfully',
    data: response,
  });
});

// google redirect==>
const googleCallback = catchAsync(async (req: Request, res: Response) => {
  let redirectTo = req.query.state ? (req.query.state as string) : '';

  if (redirectTo.startsWith('/')) {
    redirectTo = redirectTo.slice(1);
  }

  const user = req.user;

  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found');
  }

  const tokenInfo = createUserTokens(user);

  setAuthCookie(res, tokenInfo);

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

// forget password==>
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await AuthServices.forgetPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'Email Sent Successfully',
  });
});

// reset password==>
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;

  await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: 'Password reset completed successfully',
  });
});

export const AuthControllers = {
  credentialsLogin,
  verifyOtp,
  resendOtp,
  createUser,
  getNewAccessToken,
  logout,
  resetPassword,
  changePassword,
  setPassword,
  forgetPassword,
  googleCallback,
};
