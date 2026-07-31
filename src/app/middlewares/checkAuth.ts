import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../errorHelpers/AppError';
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import { User } from '../modules/users/user.model';
import httpStatus from 'http-status-codes';
import { IsActive } from '../modules/users/user.interface';

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) throw new AppError(403, 'No authorization token found');

      const verifiedToken = verifyToken(
        token,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!verifiedToken) throw new AppError(403, 'You are not authorized');

      const isUserExist = await User.findById(verifiedToken.userId);

      // throw error if the user not found==>
      if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
      }

      // throw error if the user is not verified==>
      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.UNAUTHORIZED, `User is not verified`);
      }

      // throw error if the user is inactive or blocked==>
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          `User is ${isUserExist.isActive}`
        );
      }

      // throw error if the user is deleted==>
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.UNAUTHORIZED, `User is deleted`);
      }

      const verifyRole = authRoles.includes(isUserExist?.role);

      if (!verifyRole)
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to access this feature'
        );

      req.user = verifiedToken;

      next();
    } catch (error) {
      // console.log(error);
      next(error);
    }
  };
export default checkAuth;
