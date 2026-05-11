import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { removeCookie, setAuthCookie } from '../../utils/cookie';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

// create user==>
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await AuthServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.CREATED,
      message: 'User Created Successfully',
      data: response,
    });
  }
);

// credentials login==>
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const response = await AuthServices.credentialsLogin(payload);

    // set tokens in the cookie==>
    setAuthCookie(res, response.tokens);

    // send response==>
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'User logged in successfully',
      data: response,
    });
  }
);

// get new access token==>
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// logout ==>
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    removeCookie(res, ['accessToken', 'refreshToken']);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'You have been logged out successfully',
    });
  }
);

// reset password==>
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const response = await AuthServices.resetPassword(req.body, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'Password reset completed successfully',
      data: response,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  createUser,
  getNewAccessToken,
  logout,
  resetPassword,
};
