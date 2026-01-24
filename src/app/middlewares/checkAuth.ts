import { NextFunction, Request, Response } from 'express';
import AppError from '../errorHelpers/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../config/env';
import { Role } from '../modules/users/user.interface';
import { verifyToken } from '../utils/jwt';

const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new AppError(403, 'No authorization token found');

      const verifiedToken = verifyToken(
        token,
        envVars.JWT_SECRET
      ) as JwtPayload;

      if (!verifiedToken) throw new AppError(403, 'You are not authorized');

      const verifyRole = authRoles.includes(verifiedToken?.role);

      if (!verifyRole)
        throw new AppError(401, 'You are not allowed to access this feature');
      req.user = verifiedToken;
      
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
export default checkAuth;
